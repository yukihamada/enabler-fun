
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import { FaHome, FaBuilding, FaSignInAlt, FaUserPlus, FaUser, FaCog, FaSignOutAlt, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User } from 'firebase/auth';

export default function Layout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center">
              <span className="mr-2">🏠</span> イネブラ
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <FaHome className="mr-1" /> ホーム
              </Link>
              <Link href="/properties" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <FaBuilding className="mr-1" /> 物件一覧
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <FaInfoCircle className="mr-1" /> サービス
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                <FaEnvelope className="mr-1" /> お問い合わせ
              </Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                    <FaUser className="mr-1" /> プロフィール
                  </Link>
                  <Link href="/settings" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                    <FaCog className="mr-1" /> 設定
                  </Link>
                  <button onClick={handleSignOut} className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                    <FaSignOutAlt className="mr-1" /> ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center">
                    <FaSignInAlt className="mr-1" /> ログイン
                  </Link>
                  <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center">
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
              <Link href="/contact" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                <FaEnvelope className="mr-2" /> お問い合わせ
              </Link>
              {user ? (
                <>
                  <Link href="/profile" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                    <FaUser className="mr-2" /> プロフィール
                  </Link>
                  <Link href="/settings" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                    <FaCog className="mr-2" /> 設定
                  </Link>
                  <button onClick={handleSignOut} className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                    <FaSignOutAlt className="mr-2" /> ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                    <FaSignInAlt className="mr-2" /> ログイン
                  </Link>
                  <Link href="/register" className="block py-2 text-gray-600 hover:text-blue-600 flex items-center">
                    <FaUserPlus className="mr-2" /> 新規登録
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">イネブラ（Enabler）</h3>
              <p>民泊・簡易宿泊事業のデジタル化と空間プロデュースのパイオニア</p>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">リンク</h3>
              <ul>
                <li><Link href="/about">会社概要</Link></li>
                <li><Link href="/services">サービス</Link></li>
                <li><Link href="/properties">物件一覧</Link></li>
                <li><Link href="/contact">お問い合わせ</Link></li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">お問い合わせ</h3>
              <p>〒123-4567<br />東京都渋谷区○○1-2-3</p>
              <p>TEL: 03-1234-5678</p>
              <p>Email: info@enabler.co.jp</p>
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
