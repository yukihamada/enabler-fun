import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const { propertyId, startDate, endDate, price, guestName, guestEmail } = await request.json();

    if (!propertyId || !startDate || !endDate || !price || !guestName || !guestEmail) {
      return NextResponse.json({ error: '必要な情報が不足しています' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            unit_amount: price,
            product_data: {
              name: `物件予約 (${propertyId})`,
              description: `${new Date(startDate).toLocaleDateString('ja-JP')} から ${new Date(endDate).toLocaleDateString('ja-JP')} まで`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/properties/${propertyId}`,
      customer_email: guestEmail,
      client_reference_id: propertyId,
      metadata: {
        propertyId,
        startDate,
        endDate,
        guestName,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripeセッションの作成中にエラーが発生しました:', error);
    return NextResponse.json({ error: 'チェックアウトセッションの作成に失敗しました' }, { status: 500 });
  }
}