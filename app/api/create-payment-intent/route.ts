import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // APIバージョンを修正
});

export async function POST(req: Request) {
  try {
    const { amount, invoiceId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'jpy',
      metadata: { invoiceId },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('PaymentIntent作成エラー:', error);
    return NextResponse.json({ error: 'PaymentIntentの作成に失敗しました' }, { status: 500 });
  }
}