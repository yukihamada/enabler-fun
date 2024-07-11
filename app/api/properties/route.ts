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

    const requiredFields = ['title', 'description', 'address', 'price'];
    const priceFields = ['dailyRate', 'monthlyRate'];
    const additionalFields = ['bedrooms', 'bathrooms', 'maxGuests', 'amenities', 'images', 'houseRules', 'checkInTime', 'checkOutTime'];

    const missingFields = requiredFields.filter(field => !newProperty[field]);
    const missingAdditionalFields = additionalFields.filter(field => !newProperty[field]);

    let suggestions = [];
    if (missingFields.length > 0) {
      suggestions.push(`必須項目を入力してください。例：「${missingFields[0]}」は宿泊者が物件を選ぶ際の重要な情報です。`);
    }
    if (typeof newProperty.price !== 'number' || newProperty.price <= 0) {
      suggestions.push('有効な価格を設定してください。例：「100000」（10万円）のように数値で入力してください。');
    }
    if (!newProperty.bedrooms) {
      suggestions.push('寝室の数を指定すると良いでしょう。例：「2ベッドルーム」と記載することで、家族連れの宿泊者にアピールできます。');
    }
    if (!newProperty.bathrooms) {
      suggestions.push('バスルームの数を指定すると良いでしょう。例：「バスルーム2室」と記載することで、快適さをアピールできます。');
    }
    if (!newProperty.maxGuests) {
      suggestions.push('最大宿泊人数を設定すると良いでしょう。例：「最大6名様まで宿泊可能」と記載することで、グループでの利用を促進できます。');
    }
    if (!newProperty.amenities || newProperty.amenities.length === 0) {
      suggestions.push('設備・アメニティを追加すると良いでしょう。例：「無料Wi-Fi完備、キッチン付き」などの特徴を記載すると、宿泊者の関心を引きやすくなります。');
    }
    if (!newProperty.images || newProperty.images.length === 0) {
      suggestions.push('施設の写真を追加すると良いでしょう。例：「リビングルームの明るい雰囲気が伝わる写真」を掲載すると、宿泊者の興味を引くことができます。');
    }
    if (!newProperty.houseRules) {
      suggestions.push('ハウスルールを設定すると良いでしょう。例：「禁煙、午後10時以降の騒音禁止」などのルールを明記することで、トラブルを未然に防ぐことができます。');
    }
    if (!newProperty.checkInTime || !newProperty.checkOutTime) {
      suggestions.push('チェックイン・チェックアウト時間を指定すると良いでしょう。例：「チェックイン15:00〜、チェックアウト〜11:00」と明記することで、スムーズな施設運営ができます。');
    }

    const propertyData = {
      ...newProperty,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(propertiesCollection, propertyData);
    
    return NextResponse.json({ 
      message: '民泊施設が正常に登録されました',
      url: `https://enabler.fun/properties/${docRef.id}`,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      availableFields: [...requiredFields, ...priceFields, ...additionalFields]
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