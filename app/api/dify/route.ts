import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// エラーハンドリング関数
function handleError(error: unknown) {
  console.error('エラーが発生しました:', error);
  return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
}

// メインハンドラ関数を修正
export async function POST(req: NextRequest) {
  // Dify API リクエストの処理
  if (req.headers.get('content-type') === 'application/json') {
    return handleDifyRequest(req);
  }

  // 通常の API リクエストの処理
  const body = await req.json();
  if (body.updateProperty && Array.isArray(body.updateProperty)) {
    return bulkUpdateProperties(req);
  } else {
    return updateProperty(req);
  }
}

export async function GET(req: NextRequest) {
  
    return getOpenApiSpec();
  
}

export async function PUT(req: NextRequest) {
  return updateProperty(req);
}

export async function DELETE(req: NextRequest) {
  return deleteProperty(req);
}

// Dify リクエストハンドラ
async function handleDifyRequest(req: NextRequest) {
  const expectedApiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
  const authorization = req.headers.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ') || authorization.split(' ')[1] !== expectedApiKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  if (!body || typeof body.point !== 'string' || typeof body.params !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { point, params } = body;

  try {
    switch (point) {
      case 'ping':
        return NextResponse.json({ result: 'pong' });
      case 'app.external_data_tool.query':
        return handlePropertyInfoQuery(params);
      default:
        return NextResponse.json({ error: 'Not implemented' }, { status: 400 });
    }
  } catch (error) {
    return handleError(error);
  }
}

async function handlePropertyInfoQuery(params: any) {
  const propertyId = params.property_id;

  try {
    const propertyDoc = doc(db, 'properties', propertyId);
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ result: 'Property not found' }, { status: 200 });
    }

    const propertyData = propertySnapshot.data();
    const result = `
    Property ID: ${propertySnapshot.id}
    Address: ${propertyData.address}
    Price: ${propertyData.price}
    Bedrooms: ${propertyData.bedrooms}
    Bathrooms: ${propertyData.bathrooms}
    `;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// GET: すべての物件を取得
async function getAllProperties(req: NextRequest) {
  try {
    const propertiesCollection = collection(db, 'properties');
    const propertiesSnapshot = await getDocs(propertiesCollection);
    const properties = propertiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// GET: 特定の物件を取得
async function getProperty(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
  }

  try {
    const propertyDoc = doc(db, 'properties', String(id));
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ error: '指定された物件が見つかりません' }, { status: 404 });
    }

    const propertyData = propertySnapshot.data();
    return NextResponse.json({ id: propertySnapshot.id, ...propertyData }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// POST: 新しい物件を作成
async function createProperty(req: NextRequest) {
  try {
    const body = await req.json();
    const newPropertyData = typeof body.createProperty === 'string' ? JSON.parse(body.createProperty) : body.createProperty;
    const propertiesCollection = collection(db, 'properties');
    const docRef = await addDoc(propertiesCollection, {
      ...newPropertyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return NextResponse.json({
      message: '新しい物件が作成されました',
      id: docRef.id,
      url: `https://enabler.fun/properties/${docRef.id}`
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// PUT: 物件情報を更新
async function updateProperty(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
  }

  try {
    const { updateProperty } = await req.json();
    const updateData = typeof updateProperty === 'string' ? JSON.parse(updateProperty) : updateProperty;
    const propertyDoc = doc(db, 'properties', String(id));
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ error: '指定された物件が見つかりません' }, { status: 404 });
    }

    await updateDoc(propertyDoc, {
      ...updateData,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({
      message: '物件が更新されました',
      url: `https://enabler.fun/properties/${id}`
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// PUT: 複数の物件情報を更新
async function bulkUpdateProperties(req: NextRequest) {
  try {
    const { updateProperty } = await req.json();
    const updateProperties = Array.isArray(updateProperty) ? updateProperty : [updateProperty];

    const updateResults = await Promise.all(updateProperties.map(async (property: string | Record<string, any>) => {
      const propertyData = typeof property === 'string' ? JSON.parse(property) : property;
      const { propertyId, ...updateData } = propertyData;
      const docRef = doc(db, 'properties', propertyId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return {
        id: propertyId,
        message: '物件が更新されました',
        url: `https://enabler.fun/properties/${propertyId}`
      };
    }));

    return NextResponse.json({
      message: '物件が更新されました',
      results: updateResults
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE: 物件を削除
async function deleteProperty(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
  }

  try {
    const propertyDoc = doc(db, 'properties', String(id));
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return NextResponse.json({ error: '指定さ���た物件が見つかりません' }, { status: 404 });
    }

    await deleteDoc(propertyDoc);

    return NextResponse.json({ message: '物件が削除されました' }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// OpenAPI仕様を取得する関数
async function getOpenApiSpec() {
  const filePath = path.join(process.cwd(), 'docs', 'openapi.yaml');
  console.log('Attempting to read file:', filePath);  // ファイルパスをログ出力
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    console.log('File contents read successfully');  // 成功時のログ
    return new NextResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'text/yaml',
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);  // エラー時のログ
    return new NextResponse('Error reading OpenAPI spec', { status: 500 });
  }
}