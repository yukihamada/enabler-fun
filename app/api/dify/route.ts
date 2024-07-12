import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';

// エラーハンドリング関数
function handleError(error: unknown, res: NextApiResponse) {
  console.error('エラーが発生しました:', error);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
}

// メインハンドラ関数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Dify API リクエストの処理
  if (req.headers['content-type'] === 'application/json' && req.method === 'POST') {
    return handleDifyRequest(req, res);
  }

  // 通常の API リクエストの処理
  switch (req.method) {
    case 'GET':
      if (req.query.id) {
        await getProperty(req, res);
      } else {
        await getAllProperties(req, res);
      }
      break;
    case 'POST':
      await createProperty(req, res);
      break;
    case 'PUT':
      if (req.body.updateProperty && Array.isArray(req.body.updateProperty)) {
        await bulkUpdateProperties(req, res);
      } else {
        await updateProperty(req, res);
      }
      break;
    case 'DELETE':
      await deleteProperty(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Dify リクエストハンドラ
async function handleDifyRequest(req: NextApiRequest, res: NextApiResponse) {
  const expectedApiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ') || authorization.split(' ')[1] !== expectedApiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.body || typeof req.body.point !== 'string' || typeof req.body.params !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { point, params } = req.body;

  try {
    switch (point) {
      case 'ping':
        return res.status(200).json({ result: 'pong' });
      case 'app.external_data_tool.query':
        return handlePropertyInfoQuery(params, res);
      default:
        return res.status(400).json({ error: 'Not implemented' });
    }
  } catch (error) {
    handleError(error, res);
  }
}

async function handlePropertyInfoQuery(params: any, res: NextApiResponse) {
  const propertyId = params.property_id;

  try {
    const propertyDoc = doc(db, 'properties', propertyId);
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return res.status(200).json({ result: 'Property not found' });
    }

    const propertyData = propertySnapshot.data();
    const result = `
    Property ID: ${propertySnapshot.id}
    Address: ${propertyData.address}
    Price: ${propertyData.price}
    Bedrooms: ${propertyData.bedrooms}
    Bathrooms: ${propertyData.bathrooms}
    `;

    return res.status(200).json({ result });
  } catch (error) {
    return handleError(error, res);
  }
}

// GET: すべての物件を取得
async function getAllProperties(req: NextApiRequest, res: NextApiResponse) {
  try {
    const propertiesCollection = collection(db, 'properties');
    const propertiesSnapshot = await getDocs(propertiesCollection);
    const properties = propertiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(properties);
  } catch (error) {
    handleError(error, res);
  }
}

// GET: 特定の物件を取得
async function getProperty(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const propertyDoc = doc(db, 'properties', String(id));
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return res.status(404).json({ error: '指定された物件が見つかりません' });
    }

    const propertyData = propertySnapshot.data();
    res.status(200).json({ id: propertySnapshot.id, ...propertyData });
  } catch (error) {
    handleError(error, res);
  }
}

// POST: 新しい物件を作成
async function createProperty(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = req.body;
    const newPropertyData = typeof body.createProperty === 'string' ? JSON.parse(body.createProperty) : body.createProperty;
    const propertiesCollection = collection(db, 'properties');
    const docRef = await addDoc(propertiesCollection, {
      ...newPropertyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    res.status(201).json({
      message: '新しい物件が作成されました',
      id: docRef.id,
      url: `https://enabler.fun/properties/${docRef.id}`
    });
  } catch (error) {
    handleError(error, res);
  }
}

// PUT: 物件情報を更新
async function updateProperty(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const { updateProperty } = req.body;
    const updateData = typeof updateProperty === 'string' ? JSON.parse(updateProperty) : updateProperty;
    const propertyDoc = doc(db, 'properties', String(id));
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return res.status(404).json({ error: '指定された物件が見つかりません' });
    }

    await updateDoc(propertyDoc, {
      ...updateData,
      updatedAt: serverTimestamp()
    });

    res.status(200).json({
      message: '物件が更新されました',
      url: `https://enabler.fun/properties/${id}`
    });
  } catch (error) {
    handleError(error, res);
  }
}

// PUT: 複数の物件情報を更新
async function bulkUpdateProperties(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { updateProperty } = req.body;
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

    res.status(200).json({
      message: '物件が更新されました',
      results: updateResults
    });
  } catch (error) {
    handleError(error, res);
  }
}

// DELETE: 物件を削除
async function deleteProperty(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const propertyDoc = doc(db, 'properties', String(id));
    const propertySnapshot = await getDoc(propertyDoc);

    if (!propertySnapshot.exists()) {
      return res.status(404).json({ error: '指定された物件が見つかりません' });
    }

    await deleteDoc(propertyDoc);

    res.status(200).json({ message: '物件が削除されました' });
  } catch (error) {
    handleError(error, res);
  }
}