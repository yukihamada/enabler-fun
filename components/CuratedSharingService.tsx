'use client'

import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useAuth0 } from '@auth0/auth0-react';
import { Property } from '../types/property';

export default function CuratedSharingService() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const stripe = useStripe();

  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    title: '',
    description: '',
    price: 0,
  });

  const handleApplePayClick = async () => {
    if (!stripe) {
      console.error('Stripe.js has not loaded yet.');
      return;
    }
    // Apple Pay処理のロジックをここに実装
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 新しいプロパティを追加するロジックをここに実装
  };

  return (
    <div className={`w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} p-4`}>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Curated Sharing Service</h1>
        <div>
          {isAuthenticated ? (
            <button onClick={() => logout()} className="bg-red-500 text-white px-4 py-2 rounded">
              ログアウト
            </button>
          ) : (
            <button onClick={() => loginWithRedirect()} className="bg-blue-500 text-white px-4 py-2 rounded">
              ログイン
            </button>
          )}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={newProperty.title}
          onChange={handleInputChange}
          placeholder="タイトル"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={newProperty.description}
          onChange={handleInputChange}
          placeholder="説明"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          value={newProperty.price}
          onChange={handleInputChange}
          placeholder="価格"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          onChange={handleInputChange}
          placeholder="場所"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="imageUrl"
          onChange={handleInputChange}
          placeholder="画像URL"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          プロパティを追加
        </button>
      </form>

      {stripe && (
        <button onClick={handleApplePayClick} className="mt-4 bg-black text-white px-4 py-2 rounded">
          Apple Payで支払う
        </button>
      )}

      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="mt-4 bg-gray-300 text-black px-4 py-2 rounded"
      >
        {isDarkMode ? 'ライトモード' : 'ダークモード'}に切り替え
      </button>
    </div>
  );
}