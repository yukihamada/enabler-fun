import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // Firebaseトークンを検証し、ユーザーIDを取得
    const session = await getSession();
    const userId = session?.user?.sub;

    if (!userId) {
      console.error('Auth0トークン検証失敗: ユーザーIDが見つかりません');
      return NextResponse.json({ error: '無効なAuth0トークン' }, { status: 401 });
    }

    // ここに残りのチャットロジックを実装
    // ...

    return NextResponse.json({ message: 'Chat processed successfully' });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}