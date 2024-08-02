'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import PaymentConfirmation from '../../../components/PaymentConfirmation';
import { CalendarIcon, CheckCircleIcon, CurrencyYenIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { format } from 'date-fns'; // edit_1:  日付フォーマット用の関数をインポート

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!id) {
        setError('請求書IDが見つかりません。');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/get-invoice?id=${id}`);
        if (!response.ok) {
          throw new Error('請求書データの取得に失敗しました。');
        }
        const data = await response.json();
        setInvoiceData(data);
      } catch (err) {
        setError('請求書データの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [id]);

  const handlePaymentSuccess = () => {
    router.push('/booking-confirmation');
  };

  const formattedStartDate = invoiceData?.startDate ? format(new Date(invoiceData.startDate), 'yyyy年MM月dd日') : ''; // edit_2: 日付をフォーマット
  const formattedEndDate = invoiceData?.endDate ? format(new Date(invoiceData.endDate), 'yyyy年MM月dd日') : ''; // edit_3: 日付をフォーマット

  if (loading) return <LoadingSpinner />; // edit_4: LoadingSpinnerコンポーネントを表示
  if (error) return <div>エラー: {error}</div>;
  if (!invoiceData) return <div>請求書データが見つかりません。</div>;

  return (
    <div className="payment-page bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">支払い確認</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="invoice-details mb-6 border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold mb-4">請求書詳細</h2>
            <div className="flex items-center mb-2">
              <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
              <p className="text-gray-700">予約ID: {invoiceData.id}</p>
            </div>
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
              <p className="text-gray-700">チェックイン: {formattedStartDate} </p> {/* edit_5: フォーマットした日付を表示 */}
            </div>
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
              <p className="text-gray-700">チェックアウト: {formattedEndDate} </p> {/* edit_6: フォーマットした日付を表示 */}
            </div>
            <div className="flex items-center text-lg font-semibold">
              <CurrencyYenIcon className="h-6 w-6 text-gray-500 mr-2" />
              <p className="text-gray-900">合計金額: {invoiceData.totalPrice?.toLocaleString()}</p>
            </div>
          </div>
          <div className="payment-options mb-6">
            <h3 className="text-lg font-semibold mb-4">支払い方法</h3>
            {invoiceData.totalPrice > 0 ? ( // edit_7: 合計金額が0円より大きい場合のみPaymentConfirmationを表示
              <PaymentConfirmation
                totalPrice={invoiceData.totalPrice}
                invoiceId={invoiceData.id}
                onPaymentSuccess={handlePaymentSuccess}
              />
            ) : (
              <p className="text-red-500">
                合計金額が0円のため、支払いは不要です。
              </p>
            )}
          </div>
          <div className="enabler-dao text-center text-gray-500">
            <p>Powered by Enabler DAO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;