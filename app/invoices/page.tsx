'use client';

import React, { useState, useEffect } from 'react';
import InvoiceForm from '../../components/InvoiceForm';
import Layout from '../../components/Layout';
import { collection, getDocs, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import { FaFileInvoiceDollar, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';

interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: string;
}

const CreateInvoicePage: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecentInvoices = async () => {
      try {
        const invoicesCollection = collection(db, 'invoices');
        const invoicesQuery = query(invoicesCollection, orderBy('createdAt', 'desc'), limit(10));
        const invoicesSnapshot = await getDocs(invoicesQuery);
        const invoicesList = invoicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Invoice));
        setRecentInvoices(invoicesList);
      } catch (error) {
        console.error('請求書の取得に失敗しました:', error);
      }
    };

    fetchRecentInvoices();
  }, []);

  const handleSubmit = async (invoiceData: any) => {
    try {
      const invoicesCollection = collection(db, 'invoices');
      const newInvoiceRef = await addDoc(invoicesCollection, {
        ...invoiceData,
        amount: Number(invoiceData.amount),
        createdAt: serverTimestamp(),
        status: '未払い',
      });

      setMessage(`請求書が作成されました。請求書ID: ${newInvoiceRef.id}`);
      setShowForm(false);
      
      // 請求書リストを更新
      const updatedInvoicesQuery = query(invoicesCollection, orderBy('createdAt', 'desc'), limit(10));
      const updatedInvoicesSnapshot = await getDocs(updatedInvoicesQuery);
      const updatedInvoicesList = updatedInvoicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Invoice));
      setRecentInvoices(updatedInvoicesList);
    } catch (error) {
      console.error('請求書の作成に失敗しました:', error);
      setMessage('エラー: 請求書の作成に失敗しました。もう一度お試しください。');
    }
  };

  const filteredInvoices = recentInvoices.filter(invoice =>
    (invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (invoice.id?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">請求書管理</h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center shadow-md"
              >
                {showForm ? <FaTimes className="mr-2" /> : <FaPlus className="mr-2" />}
                {showForm ? '閉じる' : '新規請求書作成'}
              </button>
            </div>

            {showForm && (
              <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 ease-in-out">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">新規請求書作成</h2>
                <InvoiceForm onSubmit={handleSubmit} />
                {message && (
                  <div className={`mt-4 p-3 rounded ${message.includes('エラー') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-2xl font-semibold mb-4">請求書一覧</h2>
                <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
                  <FaSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="請求書を検索..."
                    className="bg-transparent border-none focus:outline-none w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">請求書ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期日</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaFileInvoiceDollar className="text-gray-400 mr-2" />
                          {invoice.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.amount !== undefined ? `${invoice.amount.toLocaleString()}円` : '未設定'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === '支払済' ? 'bg-green-100 text-green-800' :
                          invoice.status === '未払い' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/invoices/${invoice.id}`} className="text-indigo-600 hover:text-indigo-900">
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default CreateInvoicePage;