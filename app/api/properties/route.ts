import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const propertiesCollection = collection(db, 'properties');
    const newProperty = await request.json();
    const docRef = await addDoc(propertiesCollection, newProperty);
    return NextResponse.json({ 
      message: '物件が正常に追加されました',
      url: `https://enabler.fun/properties/${docRef.id}`
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '物件の追加中にエラーが発生しました' }, { status: 500 });
  }
}