
import { getSession } from '@auth0/nextjs-auth0';
import { db } from '../../../lib/firebase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
const session = await getSession(request, NextResponse);
    const userId = session?.user?.sub;

    if (!userId) {
      console.error('Auth0 token verification failed: User ID not found');
      return NextResponse.json({ error: 'Invalid Auth0 token' }, { status: 401 });
    }

    const propertiesSnapshot = await db.collection('properties').get();
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
