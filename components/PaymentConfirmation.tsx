import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentConfirmationProps {
  totalPrice: number;
  invoiceId: string;
  onPaymentSuccess: () => void;
}

const PaymentForm: React.FC<PaymentConfirmationProps> = ({ totalPrice, invoiceId, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { clientSecret } = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice, invoiceId }),
      }).then(res => res.json());

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (error) {
        setPaymentError(error.message || '支払い処理中にエラーが発生しました。');
      } else if (paymentIntent.status === 'succeeded') {
        await fetch('/api/update-payment-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceId, paymentIntentId: paymentIntent.id }),
        });
        onPaymentSuccess();
      }
    } catch (err) {
      setPaymentError('支払い処理中にエラーが発生しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {paymentError && <div className="error">{paymentError}</div>}
      <button type="submit" disabled={isProcessing}>
        {isProcessing ? '処理中...' : `¥${totalPrice?.toLocaleString() ?? ''}を支払う`}
      </button>
    </form>
  );
};

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default PaymentConfirmation;