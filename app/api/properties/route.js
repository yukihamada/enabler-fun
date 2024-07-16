
import { adminDb } from '../../../lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const propertiesSnapshot = await adminDb.collection('properties').get();
    const properties = propertiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
