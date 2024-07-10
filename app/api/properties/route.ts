import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const propertiesCollection = collection(db, 'properties');
      const newProperty = req.body;
      const docRef = await addDoc(propertiesCollection, newProperty);
      res.status(201).json({ 
        message: '物件が正常に追加されました',
        url: `https://enabler.fun/properties/${docRef.id}`
      });
    } catch (error) {
      res.status(500).json({ error: '物件の追加中にエラーが発生しました' });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません' });
  }
}