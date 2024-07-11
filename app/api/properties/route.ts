import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// GET: すべての民泊施設を取得
export async function GET() {
  try {
    const propertiesCollection = collection(db, 'properties');
    const propertiesSnapshot = await getDocs(propertiesCollection);
    const properties = propertiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json(properties);
  } catch (error) {
    return handleError(error);
  }
}

// POST: 新しい民泊施設を作成
export async function POST(request: Request) {
  try {
    const newProperty = await request.json();
    const propertiesCollection = collection(db, 'properties');
    const docRef = await addDoc(propertiesCollection, {
      ...newProperty,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return NextResponse.json({ 
      message: '新しい民泊施設が作成されました',
      id: docRef.id 
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// エラーハンドリング関数
function handleError(error: unknown) {
  console.error('エラーが発生しました:', error);
  return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
}