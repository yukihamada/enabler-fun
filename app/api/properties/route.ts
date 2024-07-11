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

    const requiredFields = ['title', 'description', 'address'];
    const priceFields = ['dailyRate', 'monthlyRate'];
    const additionalFields = ['bedrooms', 'bathrooms', 'maxGuests', 'amenities', 'images', 'houseRules', 'checkInTime', 'checkOutTime'];

    const missingFields = requiredFields.filter(field => !newProperty[field]);
    const missingPriceFields = priceFields.filter(field => !newProperty[field]);
    const missingAdditionalFields = additionalFields.filter(field => !newProperty[field]);

    let suggestions = [];
    if (missingFields.length > 0) {
      suggestions.push(`必須項目を入力してください: ${missingFields.join(', ')}`);
    }
    if (missingPriceFields.length > 0) {
      suggestions.push(`料金設定を追加することをおすすめします: ${missingPriceFields.join(', ')}`);
    }
    if (!newProperty.bedrooms) {
      suggestions.push('寝室の数を指定すると、宿泊可能人数の目安になります');
    }
    if (!newProperty.bathrooms) {
      suggestions.push('バスルームの数を指定すると、施設の快適さをアピールできます');
    }
    if (!newProperty.maxGuests) {
      suggestions.push('最大宿泊人数を設定すると、予約管理がしやすくなります');
    }
    if (!newProperty.amenities || newProperty.amenities.length === 0) {
      suggestions.push('設備・アメニティ（Wi-Fi、エアコン、キッチンなど）を追加すると、宿泊者の関心を引きやすくなります');
    }
    if (!newProperty.images || newProperty.images.length === 0) {
      suggestions.push('施設の写真を追加すると、宿泊者に視覚的な情報を提供できます');
    }
    if (!newProperty.houseRules) {
      suggestions.push('ハウスルール（禁煙、ペット不可など）を設定すると、トラブルを防ぐことができます');
    }
    if (!newProperty.checkInTime || !newProperty.checkOutTime) {
      suggestions.push('チェックイン・チェックアウト時間を指定すると、スムーズな施設運営ができます');
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