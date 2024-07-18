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
      if (property.icalUrl) {
        const oldAvailableDates = property.availableDates || [];
        const newAvailableDates = await getAvailableDates(property);
        const updatedAt = admin.firestore.Timestamp.now();
        
        await db.collection('properties').doc(doc.id).update({ 
          availableDates: newAvailableDates,
          updatedAt
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

async function getAvailableDates(property: any): Promise<string[]> {
  const { icalUrl, availableFrom, availableTo } = property;
  try {
    const response = await axios.get(icalUrl);
    const icalData = response.data;
    const events = ical.parseICS(icalData);

    const start = new Date(availableFrom);
    const end = new Date(availableTo);
    const availableDates: string[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const currentDate = d.toISOString().split('T')[0];
      if (!isDateBooked(currentDate, events)) {
        availableDates.push(currentDate);
      }
    }

    return availableDates;
  } catch (error) {
    console.warn(`iCalデータの取得に失敗しました: ${icalUrl}`, error);
    if (axios.isAxiosError(error)) {
      console.warn('レスポンスデータ:', error.response?.data);
      console.warn('ステータス:', error.response?.status);
    }
    // エラーが発生しても空の配列を返す
    return [];
  }
}

function isDateBooked(date: string, events: any): boolean {
  for (const event of Object.values(events) as any[]) {
    if ('type' in event && event.type === 'VEVENT') {
      const startDate = event.start?.toISOString().split('T')[0];
      const endDate = event.end?.toISOString().split('T')[0];
      if (date >= startDate && date < endDate) {
        return true;
      }
    }
  }
  return false;
}