import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Booking } from '../../../types/bookings' // インターフェースをインポート
import { calculatePricing } from '../../../lib/pricing'; // 料金計算用の関数をインポート

// POST 関数の前に定義する
export const runtime = 'edge'; // エッジランタイムを使用

export async function POST(request: Request) {
  try {
    const { selectedDates, formData, selectedProperties } = await request.json();

    // 料金計算
    const pricing = calculatePricing(selectedDates, selectedProperties); // 日付と物件情報に基づいて料金を計算

    // 予約情報をFirestoreに保存
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      selectedDates,
      customerInfo: formData,
      properties: selectedProperties,
      createdAt: Timestamp.now(),
      status: 'pending_payment',
      pricing // 計算された料金を追加
    } as Booking); // Booking型として保存

    // 仮の支払いURL生成（実際の実装ではStripeなどの決済サービスのAPIを使用）
    const paymentUrl = `/payment/${bookingRef.id}`;

    // 成功レスポンス
    return NextResponse.json({ 
      message: '仮予約が完了しました', 
      bookingId: bookingRef.id,
      paymentUrl,
      pricing // レスポンスに料金情報を含める
    }, { status: 200 });

  } catch (error) {
    console.error('予約エラー:', error);
    return NextResponse.json({ message: '予約処理中にエラーが発生しました' }, { status: 500 });
  }
}