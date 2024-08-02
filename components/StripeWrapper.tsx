'use client'

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CuratedSharingService from './CuratedSharingService';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <CuratedSharingService />
    </Elements>
  );
}