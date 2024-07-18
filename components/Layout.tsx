'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import { FaHome, FaBuilding, FaSignInAlt, FaUserPlus, FaUser, FaCog, FaSignOutAlt, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { Alert } from '@mui/material';

export default function Layout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    // Difyチャットボットの設定を追加
    window.difyChatbotConfig = {
      token: 'rRgbpHRNzLM5fZfn'
    };

    // スクリプトを動的に追加
    const script = document.createElement('script');
    script.src = 'https://udify.app/embed.min.js';
    script.id = 'rRgbpHRNzLM5fZfn';
    script.defer = true;
    document.body.appendChild(script);

    // スタイルを動的に追加
    const style = document.createElement('style');
    style.textContent = `
      #dify-chatbot-bubble-button {
        background-color: #1C64F2 !important;
      }
    `;
    document.head.appendChild(style);

    // クリーンアップ関数
    return () => {
      document.body.removeChild(script);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 bg-underwater-pattern bg-cover bg-center">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center">
              <Image src="/logo.svg" alt="Enablerロゴ" width={80} height={80} className="mr-4" />
            </Link>
            <div className="hidden md:flex space-x-6 items-center">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <FaHome className="mr-1" /> ホーム
              </Link>
              <Link href="/properties" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <FaBuilding className="mr-1" /> 物件一覧
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <FaInfoCircle className="mr-1" /> サービス
              </Link>
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition duration-300">
                    <Image
                      src={user.picture || '/default-avatar.png'}
                      alt={user.name || 'ユーザー'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{user.name || 'ユーザー'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaUser className="inline mr-2" /> ダッシュボード
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaUser className="inline mr-2" /> プロフィール
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaCog className="inline mr-2" /> 設定
                    </Link>
                    <Link href="/api/auth/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaSignOutAlt className="inline mr-2" /> ログアウト
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/api/auth/login" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                    <FaSignInAlt className="mr-1" /> ログイン
                  </Link>
                  <Link href="/api/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center">
                    <FaUserPlus className="mr-1" /> 新規登録
                  </Link>
                </>
              )}
            </div>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {isMenuOpen && (
            <div className="md:hidden mt-4">
              <Link href="/" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                <FaHome className="mr-2" /> ホーム
              </Link>
              <Link href="/properties" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                <FaBuilding className="mr-2" /> 物件一覧
              </Link>
              <Link href="/services" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                <FaInfoCircle className="mr-2" /> サービス
              </Link>
              {user && (
                <>
                  <Link href="/dashboard" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                    <FaUser className="mr-2" /> ダッシュボード
                  </Link>
                  <Link href="/profile" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                    <FaUser className="mr-2" /> プロフィール
                  </Link>
                  <Link href="/settings" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                    <FaCog className="mr-2" /> 設定
                  </Link>
                  <Link href="/api/auth/logout" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                    <FaSignOutAlt className="mr-2" /> ログアウト
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
        {user && !user.email_verified && (
          <Alert severity="warning" className="text-center">
            メールアドレスが未認証です。メールをご確認いただき、認証を完了してください。
          </Alert>
        )}
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">イネブラ（Enabler）</h3>
              <p>民泊・簡易宿泊事業のデジタル化と空間プロデュースのパイオニア</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">リンク</h3>
              <ul>
                <li><Link href="/about" className="hover:text-blue-300 transition duration-300">会社概要</Link></li>
                <li><Link href="/services" className="hover:text-blue-300 transition duration-300">サービス</Link></li>
                <li><Link href="/properties" className="hover:text-blue-300 transition duration-300">物件一覧</Link></li>
               </ul>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">所在地</h3>
              <p>〒102-0074<br />東京都千代田区九段南１丁目６−５</p>
              <Link href="/contact" className="inline-block mt-2 text-blue-300 hover:text-blue-100 transition duration-300">
                <FaEnvelope className="inline mr-2" />
                お問い合わせはこちら
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2023 イネブラ（Enabler）. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}