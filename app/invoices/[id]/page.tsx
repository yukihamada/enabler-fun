'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, setDoc, arrayRemove, collection, query, where, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Layout from '../../../components/Layout';
import { Invoice } from '../../../types/formTypes';
import { FaUser, FaCalendarAlt, FaMoneyBillWave, FaCreditCard, FaCheckCircle, FaExclamationCircle, FaHome, FaBed, FaBath } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import Modal from 'react-modal';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeInfo {
  paymentIntentId: string;
  paymentMethod: string;
  paymentStatus: string;
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    '支払済': { bgColor: 'bg-green-100', textColor: 'text-green-800' },
    '未払い': { bgColor: 'bg-red-100', textColor: 'text-red-800' },
    'デフォルト': { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' }
  };

  const { bgColor, textColor } = statusConfig[status as keyof typeof statusConfig] || statusConfig['デフォルト'];

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

const CheckoutForm: React.FC<{ invoice: Invoice, property: any }> = ({ invoice, property }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);

  const handleReserve = async () => {
    if (isLoading) {
      return; // ユーザー情報の読み込み中は何もしない
    }

    if (!user) {
      alert('予約には会員登録が必要です。ログインページに移動します。');
      router.push('/api/auth/login');
      return;
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/invoices/${invoice.id}/complete`,
        },
      });

      if (submitError) {
        setError(submitError.message ?? '不明なエラーが発生しました');
      } else {
        setPaymentSuccess(true);
        
        // 請求書のステータスを更新
        await updateDoc(doc(db, 'invoices', invoice.id), {
          status: '支払済',
          paymentDate: new Date().toISOString(),
        });

        // 予約テーブルに追加
        await setDoc(doc(db, 'reservations', invoice.id), {
          propertyId: invoice.propertyId,
          customerId: invoice.customerId,
          checkInDate: invoice.checkInDate,
          checkOutDate: invoice.checkOutDate,
          status: '完了',
        });

        // 物件の予約可能日を更新
        const checkInDate = new Date(invoice.checkInDate);
        const checkOutDate = new Date(invoice.checkOutDate);
        const datesToRemove = [];
        for (let d = checkInDate; d < checkOutDate; d.setDate(d.getDate() + 1)) {
          datesToRemove.push(d.toISOString().split('T')[0]);
        }
        if (invoice.propertyId) {
          await updateDoc(doc(db, 'properties', invoice.propertyId), {
            availableDates: arrayRemove(...datesToRemove),
          });
        }

        if (reservationId) {
          // 仮予約を削除する代わりに、ステータスを更新
          await updateDoc(doc(db, 'temporaryReservations', reservationId), {
            status: '完了'
          });
        }
      }
    } catch (error) {
      console.error('支払い処理中にエラーが発生しました:', error);
      setError('支払い処理中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">支払いが完了しました</h2>
        <p>ありがとうございます。請求書の支払いが正常に処理されました。</p>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleReserve}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? '読み込み中...' : '予約する'}
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="予約情報入力"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>予約情報入力</h2>
        <form onSubmit={handleSubmit}>
          <PaymentElement
            options={{
              paymentMethodOrder: ['apple_pay', 'google_pay', 'card'],
              defaultValues: {
                billingDetails: {
                  name: invoice.customerName,
                }
              }
            }}
          />
          <button
            type="submit"
            disabled={!stripe || processing}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {processing ? '処理中...' : '支払う'}
          </button>
        </form>
        <button onClick={() => setIsModalOpen(false)}>閉じる</button>
      </Modal>

      {error && <div className="mt-4 text-red-500">{error}</div>}
      <div className="mt-4 text-sm text-gray-600">
        <FaCreditCard className="inline mr-2" />
        安全な支払い処理が保証されています
      </div>
    </>
  );
};

const InvoiceDetailPage: React.FC = () => {
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripeInfo, setStripeInfo] = useState<StripeInfo | null>(null);
  const [property, setProperty] = useState<any | null>(null);

  const fetchInvoice = async () => {
    try {
      const invoiceDoc = doc(db, 'invoices', params.id as string);
      const invoiceSnapshot = await getDoc(invoiceDoc);
      
      if (invoiceSnapshot.exists()) {
        const invoiceData = { id: invoiceSnapshot.id, ...invoiceSnapshot.data() } as Invoice;
        setInvoice(invoiceData);

        if (invoiceData.status === '支払済' && invoiceData.stripeInfo) {
          setStripeInfo(invoiceData.stripeInfo as StripeInfo);
        }

        if (invoiceData.status !== '支払済') {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              amount: invoiceData.amount,
              payment_method_types: ['card', 'apple_pay', 'google_pay']
            }),
          });
          const data = await response.json();
          setClientSecret(data.clientSecret);
        }

        if (invoiceData.propertyId) {
          const propertyDoc = doc(db, 'properties', invoiceData.propertyId);
          const propertySnapshot = await getDoc(propertyDoc);
          if (propertySnapshot.exists()) {
            setProperty({ id: propertySnapshot.id, ...propertySnapshot.data() });
          }
        }
      } else {
        setError('請求書が見つかりません');
      }
    } catch (err) {
      setError('請求書の取得中にエラーが発生しました: ' + (err instanceof Error ? err.message : String(err)));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cleanupExpiredReservations = async () => {
    const now = new Date();
    const expiredReservationsQuery = query(
      collection(db, 'temporaryReservations'),
      where('expiresAt', '<=', now),
      where('status', '==', '仮予約')
    );

    const expiredReservationsSnapshot = await getDocs(expiredReservationsQuery);
    expiredReservationsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  useEffect(() => {
    fetchInvoice();
    cleanupExpiredReservations();
  }, [params.id]);

  if (loading) {
    return <Layout><div className="flex justify-center items-center h-screen">読み込み中...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="flex justify-center items-center h-screen text-red-600">{error}</div></Layout>;
  }

  if (!invoice) {
    return <Layout><div className="flex justify-center items-center h-screen">請求書が見つかりません</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-indigo-600 text-white">
            <h3 className="text-lg leading-6 font-medium">
              請求書詳細
            </h3>
            <p className="mt-1 max-w-2xl text-sm">
              請求書 ID: {invoice.id}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaUser className="mr-2" />
                  顧客名
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{invoice.customerName}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaMoneyBillWave className="mr-2" />
                  金額
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{invoice.amount.toLocaleString()}円</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  チェックイン日
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(invoice.checkInDate)}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  チェックアウト日
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(invoice.checkOutDate)}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  支払期限
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(invoice.dueDate)}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaCheckCircle className="mr-2" />
                  状態
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <StatusBadge status={invoice.status} />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {invoice.status === '支払済' && stripeInfo && (
          <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-green-600 text-white">
              <h3 className="text-lg leading-6 font-medium">
                支払い情報
              </h3>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">支払い方法</dt>
                  <dd className="mt-1 text-sm text-gray-900">{stripeInfo.paymentMethod}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">支払い状態</dt>
                  <dd className="mt-1 text-sm text-gray-900">{stripeInfo.paymentStatus}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">トランザクションID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{stripeInfo.paymentIntentId}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {property && (
          <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-blue-600 text-white">
              <h3 className="text-lg leading-6 font-medium">
                物件情報
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FaHome className="mr-2" />
                    物件名
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{property.name}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FaBed className="mr-2" />
                    寝室数
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{property.bedrooms}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FaBath className="mr-2" />
                    バスルーム数
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{property.bathrooms}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {invoice.status !== '支払済' && clientSecret && (
          <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-green-600 text-white">
              <h3 className="text-lg leading-6 font-medium">
                支払い
              </h3>
            </div>
            <div className="p-6">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm invoice={invoice} property={property} />
              </Elements>
            </div>
          </div>
        )}

        {invoice.status === '未払い' && new Date(invoice.dueDate) < new Date() && (
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">支払期限が過ぎています</p>
            <p>できるだけ早く支払いを完了してください。</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceDetailPage;