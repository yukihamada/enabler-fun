import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Firebaseの初期化コード（省略）

export async function POST(req: Request) {
  try {
    const { propertyId, userId, startDate, endDate, totalPrice, description } = await req.json();

    const invoiceRef = await admin.firestore().collection('invoices').add({
      propertyId,
      userId,
      startDate,
      endDate,
      totalPrice: Number(totalPrice),
      description,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({ invoiceId: invoiceRef.id }, { status: 201 });
  } catch (error) {
    console.error('請求書作成エラー:', error);
    return NextResponse.json({ error: '請求書の作成に失敗しました' }, { status: 500 });
  }
}