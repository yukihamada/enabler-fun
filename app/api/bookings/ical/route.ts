import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import ical from 'ical-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const searchParams = new URLSearchParams(request.nextUrl.search);
  if (!searchParams.has('propertyId')) {
    return new Response('Property ID is required', { status: 400 });
  }
  const propertyId = searchParams.get('propertyId') || '';
  const token = searchParams.get('token');

  try {
    // 物件ドキュメントからiCalURLを取得
const session = await getSession(request, NextResponse);
    const userId = session?.user?.sub;

    if (!userId) {
      console.error('Auth0 token verification failed: User ID not found');
      return NextResponse.json({ error: 'Invalid Auth0 token' }, { status: 401 });
    }

const propertyRef = doc(db, 'properties', propertyId);
    const propertyDoc = await getDoc(propertyRef);

    if (!propertyDoc.exists()) {
      return new Response('Property not found', { status: 404 });
    }

    const propertyData = propertyDoc.data();
    const icalUrl = propertyData.icalUrl;

    if (!icalUrl) {
      return new Response('iCal URL not found for this property', { status: 404 });
    }

    // トークンの検証
    const tokenDoc = await getDoc(doc(db, 'icalTokens', propertyId));
    const validToken = tokenDoc.exists() ? tokenDoc.data().token : null;

    let icalData;

    if (token === validToken) {
      // トークンが正しい場合、Firebaseの予約状況を返す
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('propertyId', '==', propertyId));
      const bookingsSnapshot = await getDocs(q);
      
      const calendar = ical({ name: 'Bookings' });
      
      bookingsSnapshot.forEach((doc) => {
        const booking = doc.data();
        calendar.createEvent({
          start: booking.startDate.toDate(),
          end: booking.endDate.toDate(),
          summary: '予約あり',
          description: `Guest: ${booking.guestName}`,
        });
      });
      
      icalData = calendar.toString();
    } else {
      // トークンがない場合、iCalURLの内容を取得して修正
      const response = await fetch(icalUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch iCal data');
      }
      icalData = await response.text();
      
      // SUMMARY:の部分を「予約あり」に変更
      icalData = icalData.replace(/SUMMARY:.*$/gm, 'SUMMARY:予約あり');
    }

    // レスポンスヘッダーを設定
    const headers = new Headers();
    headers.set('Content-Type', 'text/calendar');
    headers.set('Content-Disposition', `attachment; filename="bookings-${propertyId}.ics"`);

    // iCalデータを返す
    return new NextResponse(icalData, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('iCalデータの取得中にエラーが発生しました:', error);
    return NextResponse.json({ error: 'iCalデータの取得中にエラーが発生しました' }, { status: 500 });
  }
}
