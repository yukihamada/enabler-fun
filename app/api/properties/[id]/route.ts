import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

// GET: 特定の民泊施設を取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const propertyDoc = doc(db, 'properties', params.id);
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ error: '指定された民泊施設が見つかりません' }, { status: 404 });
    }

    const propertyData = propertySnapshot.data();
    return NextResponse.json({ id: propertySnapshot.id, ...propertyData });
  } catch (error) {
    return handleError(error);
  }
}

// PUT: 民泊施設情報を更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedProperty = await request.json();
    const propertyDoc = doc(db, 'properties', params.id);

    await updateDoc(propertyDoc, {
      ...updatedProperty,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ 
      message: '民泊施設情報が更新されました',
      updatedId: params.id
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

    return NextResponse.json({ message: '民泊施設が削除されました' }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// エラーハンドリング関数
function handleError(error: unknown) {
  console.error('エラーが発生しました:', error);
  return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
}