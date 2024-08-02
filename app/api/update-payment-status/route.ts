import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Firebaseの初期化コード（省略）

export async function POST(req: Request) {
  try {
    const { invoiceId, paymentIntentId } = await req.json();

    await admin.firestore().collection('invoices').doc(invoiceId).update({
      status: 'paid',
      paymentIntentId,
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('支払い状態更新エラー:', error);
    return NextResponse.json({ error: '支払い状態の更新に失敗しました' }, { status: 500 });
  }
}