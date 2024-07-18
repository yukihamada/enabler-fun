import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const membershipPrices: Record<string, string> = {
  'シルバー': 'price_xxxxxxxxxxxxx1',
  'ゴールド': 'price_xxxxxxxxxxxxx2',
  'プラチナ': 'price_xxxxxxxxxxxxx3',
};

export async function POST(request: Request) {
  try {
    const { level } = await request.json();

    if (!level || !(level in membershipPrices)) {
      return NextResponse.json({ error: '無効なメンバーシップレベルです' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: membershipPrices[level],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/membership`,
      metadata: {
        membershipLevel: level,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripeセッションの作成中にエラーが発生しました:', error);
    return NextResponse.json({ error: 'チェックアウトセッションの作成に失敗しました' }, { status: 500 });
  }
}