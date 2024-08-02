'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Layout from '../../../components/Layout';
import Link from 'next/link';

interface PropertyInfo {
  name: string;
  address: string;
  rentAmount: number;
}

const PaymentCompletePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'success' | 'failure' | 'processing'>('processing');
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);

  useEffect(() => {
    const updateInvoiceStatus = async () => {
      const paymentIntent = searchParams.get('payment_intent');
      const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

      if (paymentIntent && paymentIntentClientSecret) {
        try {
          const response = await fetch(`/api/check-payment-status?payment_intent=${paymentIntent}`);
          const data = await response.json();

          if (data.status === 'succeeded') {
            const invoiceRef = doc(db, 'invoices', params.id as string);
            const invoiceDoc = await getDoc(invoiceRef);
            
            if (invoiceDoc.exists()) {
              const invoiceData = invoiceDoc.data();
              setPropertyInfo({
                name: invoiceData.propertyName,
                address: invoiceData.propertyAddress,
                rentAmount: invoiceData.rentAmount
              });
            }

            await updateDoc(invoiceRef, { status: '支払済' });
            setStatus('success');
          } else {
            setStatus('failure');
          }
        } catch (error) {
          console.error('Error updating invoice status:', error);
          setStatus('failure');
        }
      } else {
        setStatus('failure');
      }
    };

    updateInvoiceStatus();
  }, [params.id, searchParams]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-indigo-600 text-white">
            <h3 className="text-lg leading-6 font-medium">
              請求書支払い結果
            </h3>
          </div>
          <div className="p-6">
            {status === 'processing' && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="ml-2">請求書の支払い状況を確認中...</p>
              </div>
            )}
            {status === 'success' && propertyInfo && (
              <>
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <p className="text-green-600 font-semibold">請求書の支払いが完了しました。ありがとうございます。</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">物件情報</h4>
                  <p><span className="font-medium">物件名：</span>{propertyInfo.name}</p>
                  <p><span className="font-medium">住所：</span>{propertyInfo.address}</p>
                  <p><span className="font-medium">家賃：</span>{propertyInfo.rentAmount.toLocaleString()}円</p>
                </div>
                <p className="mb-4">請求書の状態が「支払済」に更新されました。</p>
                <Link href={`/invoices/${params.id}`} className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                  請求書詳細を確認する
                </Link>
              </>
            )}
            {status === 'failure' && (
              <>
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <p className="text-red-600 font-semibold">請求書の支払いに失敗しました。</p>
                </div>
                <p className="mb-4">請求書の状態は更新されていません。もう一度お試しください。</p>
                <Link href={`/invoices/${params.id}`} className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                  請求書詳細に戻り再試行する
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentCompletePage;