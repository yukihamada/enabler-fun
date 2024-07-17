import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { db } from '@/lib/firebase';
import { getDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

// GET: 特定の民泊施設を取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
const session = await getSession(request, NextResponse);
    const userId = session?.user?.sub;

    if (!userId) {
      console.error('Auth0 token verification failed: User ID not found');
      return NextResponse.json({ error: 'Invalid Auth0 token' }, { status: 401 });
    }

const propertyDoc = doc(db, 'properties', params.id);
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ error: '指定された民泊施設が見つかりません' }, { status: 404 });
    }

    const propertyData = propertySnapshot.data();
    return NextResponse.json({
      id: propertySnapshot.id,
      ...propertyData,
      requestData: { params } // リクエストデータを含める
    });
  } catch (error) {
    return handleError(error);
  }
}

// PUT: 特定の民泊施設を更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
const session = await getSession(request, NextResponse);
    const userId = session?.user?.sub;

    if (!userId) {
      console.error('Auth0 token verification failed: User ID not found');
      return NextResponse.json({ error: 'Invalid Auth0 token' }, { status: 401 });
    }

    const updateData = await request.json();
    const propertyDoc = doc(db, 'properties', params.id);
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ error: '指定された民泊施設が見つかりません' }, { status: 404 });
    }

    if (!updateData || typeof updateData !== 'object') {
      return NextResponse.json({ error: '無効な更新データです' }, { status: 400 });
    }

    if (updateData.id && updateData.id !== params.id) {
      return NextResponse.json({ error: 'プロパティIDが一致しません' }, { status: 400 });
    }

    const propertyData = { ...updateData };
    delete propertyData.id;

    // CORSヘッダーを設定
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    await updateDoc(propertyDoc, {
      ...propertyData,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ 
      message: '民泊施設が更新されました',
      url: `https://enabler.fun/properties/${params.id}`,
      requestData: { params, updateData } // リクエストデータを含める
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE: 民泊施設を削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const propertyDoc = doc(db, 'properties', params.id);
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ error: '指定された民泊施設が見つかりません' }, { status: 404 });
    }

    await deleteDoc(propertyDoc);

    return NextResponse.json({
      message: '民泊施設が削除されました',
      requestData: { params } // リクエストデータを含める
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
