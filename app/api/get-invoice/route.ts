import { NextRequest, NextResponse } from 'next/server';
import { Invoice } from '@/types/invoice';
import { db } from '@/lib/firebase'; // dbをインポートします
import { collection, getDoc, doc } from 'firebase/firestore'; // 追加: Firestore のメソッドをインポート

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: '請求書IDが必要です' }, { status: 400 });
  }

  try {
    const invoice = await getInvoiceById(id, db); // dbを渡します
    if (!invoice) {
      return NextResponse.json({ error: '請求書が見つかりません' }, { status: 404 });
    }
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('請求書の取得中にエラーが発生しました:', error);
    return NextResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
  }
}

export async function getInvoiceById(id: string, db: any): Promise<Invoice | null> {
  // Firestoreから請求書を取得する例
  try {
    const invoiceRef = doc(collection(db, 'bookings'), id); // 変更: 正しいFirestoreの参照を取得
    const snapshot = await getDoc(invoiceRef); // 変更: getDocを使用してドキュメントを取得
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as Invoice;
  } catch (error) {
    console.error('Firestoreからの請求書の取得中にエラーが発生しました:', error);
    throw error;
  }
}