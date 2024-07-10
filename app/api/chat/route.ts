import { supabase } from '../../../lib/supabaseClient';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { message, idToken } = await req.json();

    if (!process.env.DIFY_API_ENDPOINT || !process.env.DIFY_API_KEY) {
      throw new Error('DIFY_API_ENDPOINT or DIFY_API_KEY is not set');
    }

// Supabaseトークンを検証し、ユーザーIDを取得
    const { data: { user }, error } = await supabase.auth.api.getUser(idToken);
    if (error) {
      console.error('Supabase token verification failed:', error);
      return NextResponse.json({ error: 'Invalid Supabase token' }, { status: 401 });
    }
    const userId = user.id;

    console.log('Request URL:', `${process.env.DIFY_API_ENDPOINT}/chat-messages`);
    console.log('Request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DIFY_API_KEY.substring(0, 5)}...`
    });
    console.log('Request body:', JSON.stringify({
      user: userId,
      messages: [{ role: 'user', content: message }]
    }));

    const response = await fetch(`${process.env.DIFY_API_ENDPOINT}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`
      },
      body: JSON.stringify({
        user: userId,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Dify API error:', errorData);
      return NextResponse.json({ error: `Error communicating with Dify API: ${response.status} ${response.statusText}`, details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'An unexpected error occurred', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unexpected error occurred', details: 'Unknown error' }, { status: 500 });
    }
  }
}
