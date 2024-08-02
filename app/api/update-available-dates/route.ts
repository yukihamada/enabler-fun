import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import ical from 'node-ical';
import axios from 'axios';

// Firebase初期化
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not defined');
  }
  const serviceAccount = JSON.parse(serviceAccountKey);

  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!storageBucket) {
    throw new Error('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not defined');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket
  });
}

const db = admin.firestore();

export async function POST() {
  try {
    const properties = await db.collection('properties').get();
    const updateResults = [];

    for (const doc of properties.docs) {
      const property = doc.data();
      if (property.icalUrls) {
        const oldAvailableDates = property.availableDates || [];
        const { availableDates: newAvailableDates, calendarBookings } = await getAvailableDates(property);
        const updatedAt = admin.firestore.Timestamp.now();
        
        await db.collection('properties').doc(doc.id).update({ 
          availableDates: newAvailableDates,
          updatedAt,
          calendarBookings
        });

        updateResults.push({
          propertyId: doc.id,
          oldCount: oldAvailableDates.length,
          newCount: newAvailableDates.length,
          added: newAvailableDates.filter((date: string) => !oldAvailableDates.includes(date)),
          removed: oldAvailableDates.filter((date: string) => !newAvailableDates.includes(date))
        });
      }
    }

    return NextResponse.json({ 
      message: '利用可能日の更新が完了しました',
      updateResults 
    }, { status: 200 });
  } catch (error) {
    console.error('エラー:', error);
    return NextResponse.json({ 
      error: '内部サーバーエラー', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function getAvailableDates(property: any): Promise<{ availableDates: string[], calendarBookings: { [key: string]: number } }> {
  const { icalUrls, availableFrom, availableTo, closedDays = [] } = property;
  const availableDates: string[] = [];
  const calendarBookings: { [key: string]: number } = {};

  try {
    const start = new Date(availableFrom);
    const end = new Date(availableTo);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const icalUrl of icalUrls) {
      const response = await axios.get(icalUrl);
      const icalData = response.data;
      const events = ical.parseICS(icalData);
      let bookingCount = 0;

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d < today) continue;
        const currentDate = d.toISOString().split('T')[0];
        const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
        if (isDateBooked(currentDate, Object.values(events))) {
          bookingCount++;
        } else if (!closedDays.includes(dayOfWeek)) {
          availableDates.push(currentDate);
        }
      }

      calendarBookings[icalUrl] = bookingCount;
    }

    return { 
      availableDates: availableDates.filter((date, index, self) => 
        self.indexOf(date) === index
      ),
      calendarBookings 
    };
  } catch (error) {
    console.warn(`iCalデータの取得に失敗しました: ${icalUrls.join(', ')}`, error);
    if (axios.isAxiosError(error)) {
      console.warn('レスポンスデータ:', error.response?.data);
      console.warn('ステータス:', error.response?.status);
    }
    // 発生した場合は空の配列を返す
    return { availableDates: [], calendarBookings: {} };
  }
}

function isDateBooked(date: string, events: any[]): boolean {
  return events.some(event => {
    if (event.type === 'VEVENT') {
      const startDate = event.start?.toISOString().split('T')[0];
      const endDate = event.end?.toISOString().split('T')[0];
      const nextDay = new Date(startDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toISOString().split('T')[0];
      
      // チェックインの日の次の日をチェックアウト可能にする
      return date > startDate && date < endDate && date !== nextDayString;
    }
    return false;
  });
}