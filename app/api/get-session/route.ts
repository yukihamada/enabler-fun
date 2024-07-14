import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      startDate: session.metadata?.startDate,
      endDate: session.metadata?.endDate,
      amount: session.amount_total,
    });
  } catch (error) {
    console.error('Error retrieving Stripe session:', error);
    return NextResponse.json({ error: 'Failed to retrieve session details' }, { status: 500 });
  }
}