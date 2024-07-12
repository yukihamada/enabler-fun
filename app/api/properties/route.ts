import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

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
    const body = await request.json();
    const propertiesCollection = collection(db, 'properties');
    const docRef = await addDoc(propertiesCollection, {
      ...body.createProperty,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return NextResponse.json({
      message: '新しい民泊施設が作成されました',
      id: docRef.id,
      url: `https://enabler.fun/properties/${docRef.id}`,
      data: body // リクエストデータを含める
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// PUT: 民泊施設情報を更新
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updateProperties = Array.isArray(body.updateProperty) ? body.updateProperty : [body.updateProperty];

    const updateResults = await Promise.all(updateProperties.map(async (property: string | Record<string, any>) => {
      const propertyData = typeof property === 'string' ? JSON.parse(property) : property;
      const { propertyId, ...updateData } = propertyData;
      const docRef = doc(db, 'properties', propertyId); // 修正: doc() の引数を修正
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return {
        id: propertyId,
        message: '民泊施設が更新されました',
        url: `https://enabler.fun/properties/${propertyId}`
      };
    }));

    return NextResponse.json({
      message: '民泊施設が更新されました',
      results: updateResults,
      data: body // リクエストデータを含める
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// エラーハンドリング関数
function handleError(error: unknown) {
  console.error('エラーが発生しました:', error);
  return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
}