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

// PATCH: 特定の民泊施設を更新
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { updateProperty } = await request.json();
    const updateData = JSON.parse(updateProperty);
    const propertyDoc = doc(db, 'properties', params.id);
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ error: '指定された民泊施設が見つかりません' }, { status: 404 });
    }

    if (!updateData || typeof updateData !== 'object') {
      return NextResponse.json({ error: '無効な更新データです' }, { status: 400 });
    }

    const { propertyId, ...propertyData } = updateData;

    if (propertyId && propertyId !== params.id) {
      return NextResponse.json({ error: 'プロパティIDが一致しません' }, { status: 400 });
    }

    await updateDoc(propertyDoc, {
      ...propertyData,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ 
      message: '民泊施設が更新されました',
      id: params.id
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