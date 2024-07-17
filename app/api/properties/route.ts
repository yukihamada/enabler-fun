import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

interface Property {
  id: string;
  status: string;
  [key: string]: any;
}

// GET: 民泊施設を取得（ステータスでフィルタリング可能）
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const propertiesCollection = collection(db, 'properties');
    const propertiesSnapshot = await getDocs(propertiesCollection);
    let properties = propertiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Property));

    if (status) {
      if (status === 'all') {
        // 全ての物件を返す（フィルタリングなし）
      } else {
        // 指定されたステータスでフィルタリング
        properties = properties.filter((property: Property) => property.status === status);
      }
    } else {
      // デフォルトは公開中の物件のみ
      properties = properties.filter((property: Property) => property.status === 'published');
    }

    return NextResponse.json(properties);
  } catch (error) {
    return handleError(error);
  }
}

// POST: 新しい民泊施設を作成
export async function POST(request: Request) {
  try {
    const createProperty = await request.json();
    const propertiesCollection = collection(db, 'properties');
    const docRef = await addDoc(propertiesCollection, {
      ...createProperty,
      status: 'draft', // デフォルトの状態を「下書き」に設定
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return NextResponse.json({
      message: '新しい民泊施設が作成されました',
      id: docRef.id,
      url: `https://enabler.fun/properties/${docRef.id}`,
      data: createProperty // リクエストデータを含める
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