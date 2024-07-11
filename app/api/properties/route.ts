import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp, FirestoreError } from 'firebase/firestore';

function handleError(error: unknown) {
  if (error instanceof FirestoreError) {
    switch (error.code) {
      case 'permission-denied':
        return NextResponse.json({ error: 'データベースへの権限がありません', details: error }, { status: 403 });
      case 'unavailable':
        return NextResponse.json({ error: 'データベースが一時的に利用できません', details: error }, { status: 503 });
      default:
        return NextResponse.json({ error: `Firestoreエラー: ${error.message}`, details: error }, { status: 500 });
    }
  } else if (error instanceof SyntaxError) {
    return NextResponse.json({ error: '無効なJSONデータが送信されました', details: error }, { status: 400 });
  } else {
    return NextResponse.json({ error: `予期せぬエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`, details: error }, { status: 500 });
  }
}

// POST: 新しい民泊施設を登録
export async function POST(request: Request) {
  try {
    const propertiesCollection = collection(db, 'properties');
    const newProperty = await request.json();

    const allFields = [
      'title', 'description', 'address', 'price', 'dailyRate', 'monthlyRate',
      'bedrooms', 'bathrooms', 'maxGuests', 'amenities', 'images', 'houseRules',
      'latitude', 'longitude', 'nearbyAttractions',
      'furnishings', 'availableFrom', 'availableTo', 'specialOffers', 'nearbyFacilities',
      'smokingAllowed', 'petsAllowed', 'wifiInfo', 'cleaningFee', 'parking',
      'cancellationPolicy', 'surroundings', 'nearbyStations'
    ];

    let missingFields: string[] = [];
    let propertyData: Record<string, any> = {};

    allFields.forEach(field => {
      if (newProperty[field] !== undefined) {
        propertyData[field] = newProperty[field];
      } else {
        missingFields.push(field);
      }
    });

    // 日付フィールドの処理
    ['availableFrom', 'availableTo'].forEach(field => {
      if (propertyData[field]) {
        propertyData[field] = new Date(propertyData[field]);
      }
    });

    // 配列フィールドの処理
    ['images', 'amenities', 'houseRules', 'nearbyAttractions', 'furnishings', 'specialOffers', 'nearbyFacilities', 'nearbyStations'].forEach(field => {
      if (typeof propertyData[field] === 'string') {
        propertyData[field] = [propertyData[field]];
      } else if (!Array.isArray(propertyData[field])) {
        propertyData[field] = [];
      }
    });

    propertyData = {
      ...propertyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(propertiesCollection, propertyData);
    
    return NextResponse.json({ 
      message: '民泊施設が正常に登録されました',
      url: `https://enabler.fun/properties/${docRef.id}`,
      missingFields: missingFields.length > 0 ? missingFields : undefined,
      availableFields: allFields
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

// PUT: 民泊施設情報を更新（デバッグ用に簡略化）
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedProperty = await request.json();

    // デバッグ用のログ出力
    console.log("受信したデータ:", JSON.stringify(updatedProperty, null, 2));
    console.log("更新対象のID:", params.id);

    // 適当な応答を返す
    return NextResponse.json({ 
      message: '民泊施設情報が更新されました（デバッグモード）',
      updatedId: params.id,
      receivedData: updatedProperty
    }, { status: 200 });
  } catch (error) {
    console.error("エラー発生:", error);
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