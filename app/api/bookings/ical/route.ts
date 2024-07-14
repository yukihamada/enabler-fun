import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
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

  try {
    // Firestoreから予約データを取得
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where("propertyId", "==", propertyId));
    const querySnapshot = await getDocs(q);

    // iCalデータを生成
    const calendar = ical({ name: `予約 - 物件ID: ${propertyId}` });

    querySnapshot.forEach((doc) => {
      const booking = doc.data();
      calendar.createEvent({
        start: booking.startDate.toDate(),
        end: booking.endDate.toDate(),
        summary: `予約 - ${booking.name}`,
        description: `予約者: ${booking.name}\n電話番号: ${booking.phoneNumber}`,
        location: propertyId,
      });
    });

    // iCalデータを文字列として生成
    const icalString = calendar.toString();

    // レスポンスヘッダーを設定
    const headers = new Headers();
    headers.set('Content-Type', 'text/calendar');
    headers.set('Content-Disposition', `attachment; filename="bookings-${propertyId}.ics"`);

    // iCalデータを返��
    return new NextResponse(icalString, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('iCalデータの生成中にエラーが発生しました:', error);
    return NextResponse.json({ error: 'iCalデータの生成中にエラーが発生しました' }, { status: 500 });
  }
}