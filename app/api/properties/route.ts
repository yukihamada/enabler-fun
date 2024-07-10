import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, FirestoreError, serverTimestamp } from 'firebase/firestore';
import { auth } from '../../../lib/firebase';

export async function POST(request: Request) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const propertiesCollection = collection(db, 'properties');
    const newProperty = await request.json();

    // 必須フィールドのチェックと検証
    const requiredFields = ['title', 'price', 'description', 'address'];
    for (const field of requiredFields) {
      if (!newProperty[field]) {
        return NextResponse.json({ error: `必須フィールド（${field}）が欠落しています` }, { status: 400 });
      }
    }

    if (typeof newProperty.price !== 'number' || newProperty.price <= 0) {
      return NextResponse.json({ error: '価格は正の数値である必要があります' }, { status: 400 });
    }

    // ユーザーIDとタイムスタンプを追加
    const propertyData = {
      ...newProperty,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(propertiesCollection, propertyData);
    return NextResponse.json({ 
      message: '物件が正常に追加されました',
      url: `https://enabler.fun/properties/${docRef.id}`
    }, { status: 201 });
  } catch (error) {
    if (error instanceof FirestoreError) {
      // Firestoreの特定のエラーを処理
      switch (error.code) {
        case 'permission-denied':
          return NextResponse.json({ error: 'データベースへの書き込み権限がありません' }, { status: 403 });
        case 'unavailable':
          return NextResponse.json({ error: 'データベースが一時的に利用できません' }, { status: 503 });
        default:
          return NextResponse.json({ error: `Firestoreエラー: ${error.message}` }, { status: 500 });
      }
    } else if (error instanceof SyntaxError) {
      return NextResponse.json({ error: '無効なJSONデータが送信されました' }, { status: 400 });
    } else {
      return NextResponse.json({ error: `予期せぬエラーが発生しました: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
    }
  }
}