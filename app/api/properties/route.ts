import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, FirestoreError } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const propertiesCollection = collection(db, 'properties');
    const newProperty = await request.json();

    // 必須フィールドのチェック
    if (!newProperty.title || !newProperty.price) {
      return NextResponse.json({ error: '必須フィールド（タイトルまたは価格）が欠落しています' }, { status: 400 });
    }

    const docRef = await addDoc(propertiesCollection, newProperty);
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