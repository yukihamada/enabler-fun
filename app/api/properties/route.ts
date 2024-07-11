import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, FirestoreError, serverTimestamp, query, where } from 'firebase/firestore';

function handleError(error: unknown) {
  if (error instanceof FirestoreError) {
    switch (error.code) {
      case 'permission-denied':
        return NextResponse.json({ error: 'データベースへの権限がありません' }, { status: 403 });
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

// POST: 新しい民泊施設を登録
export async function POST(request: Request) {
  try {
    const propertiesCollection = collection(db, 'properties');
    const newProperty = await request.json();

    const requiredFields = ['title', 'description', 'address', 'price'];
    const priceFields = ['dailyRate', 'monthlyRate'];
    const additionalFields = ['bedrooms', 'bathrooms', 'maxGuests', 'amenities', 'images', 'houseRules', 'checkInTime', 'checkOutTime'];

    let suggestions = [];
    
    // 必須フィールドのチェック
    requiredFields.forEach(field => {
      if (!newProperty[field]) {
        suggestions.push(`「${field}」は必須項目です。宿泊者が物件を選ぶ際の重要な情報です。`);
      }
    });


    // その他のフィールドのチェックと提案
    if (!newProperty.bedrooms) suggestions.push('寝室の数を指定すると良いでしょう。例：「2ベッドルーム」と記載することで、家族連れの宿泊者にアピー��できます。');
    if (!newProperty.bathrooms) suggestions.push('バスルームの数を指定すると良いでしょう。例：「バスルーム2室」と記載することで、快適さをアピールできます。');
    if (!newProperty.maxGuests) suggestions.push('最大宿泊人数を設定すると良いでしょう。例：「最大6名様まで宿泊可能」と記載することで、グループでの利用を促進できます。');
    if (!newProperty.amenities || (Array.isArray(newProperty.amenities) && newProperty.amenities.length === 0)) suggestions.push('設備・アメニティを追加すると良いでしょう。例：「無料Wi-Fi完備、キッチン付き」などの特徴を記載すると、宿泊者の関心を引きやすくなります。');
    if (!newProperty.images || (Array.isArray(newProperty.images) && newProperty.images.length === 0)) suggestions.push('施設の写真を追加すると良いでしょう。例：「リビングルームの明るい雰囲気が伝わる写真」を掲載すると、宿泊者の興味を引くことができます。');
    if (!newProperty.houseRules) suggestions.push('ハウスルールを設定すると良いでしょう。例：「禁煙、午後10時以降の騒音禁止」などのルールを明記することで、トラブルを未然に防ぐことが��きます。');
    if (!newProperty.checkInTime || !newProperty.checkOutTime) suggestions.push('チェックイン・チェックアウト時間を指定すると良いでしょう。例：「チェックイン15:00〜、チェックアウト〜11:00」と明記することで、スムーズな施設運営ができます。');

    // フィールドの型変換と日付処理
    ['images', 'amenities', 'houseRules'].forEach(field => {
      if (typeof newProperty[field] === 'string') {
        newProperty[field] = [newProperty[field]];
      } else if (!Array.isArray(newProperty[field])) {
        newProperty[field] = [];
      }
    });

    ['checkInTime', 'checkOutTime'].forEach(field => {
      if (newProperty[field]) {
        newProperty[field] = new Date(newProperty[field]);
      }
    });

    const propertyData = {
      ...newProperty,
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
    return handleError(error);
  }
}

// GET: 民泊施設を取得（全てまたは特定の1件）
export async function GET(request: Request, { params }: { params?: { id?: string } } = {}) {
  try {
    if (params?.id) {
      // 特定の民泊施設を取得
      const propertyDoc = doc(db, 'properties', params.id);
      const propertySnapshot = await getDoc(propertyDoc);

      if (!propertySnapshot.exists()) {
        return NextResponse.json({ error: '指定された民泊施設が見つかりません' }, { status: 404 });
      }

      const propertyData = propertySnapshot.data();

      return NextResponse.json({ id: propertySnapshot.id, ...propertyData });
    } else {
      // 全ての民泊施設を取得
      const propertiesCollection = collection(db, 'properties');
      const querySnapshot = await getDocs(propertiesCollection);

      const properties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json(properties);
    }
  } catch (error) {
    return handleError(error);
  }
}

// PUT: 民泊施設情報を更新
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const propertyDoc = doc(db, 'properties', params.id);
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ error: '指定された民泊施設が見つかりません' }, { status: 404 });
    }

    const propertyData = propertySnapshot.data();

    const updatedProperty = await request.json();

    const updatedPropertyData = {
      ...propertyData,
      ...updatedProperty,
      updatedAt: serverTimestamp()
    };

    await updateDoc(propertyDoc, updatedPropertyData);

    return NextResponse.json({ message: '民泊施設情報が更新されました' }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE: 民泊施設を削除
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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