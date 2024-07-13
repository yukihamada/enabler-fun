import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { propertyId, userId, startDate, endDate, totalPrice } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'jpy',
              product_data: {
                name: `予約: ${propertyId}`,
                description: `${startDate}から${endDate}まで`,
              },
              unit_amount: totalPrice,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/properties/${propertyId}`,
        metadata: {
          propertyId,
          userId,
          startDate,
          endDate,
        },
      });

      res.status(200).json({ id: session.id });
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}