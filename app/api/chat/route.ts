import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';

// Firebase Adminの初期化
if (!getApps().length) {
  initializeApp();
}

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // Firebaseトークンを検証し、ユーザーIDを取得
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!userId) {
      console.error('Firebase token verification failed: User ID not found');
      return NextResponse.json({ error: 'Invalid Firebase token' }, { status: 401 });
    }

    // ここに残りのチャットロジックを実装
    // ...

    return NextResponse.json({ message: 'Chat processed successfully' });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}