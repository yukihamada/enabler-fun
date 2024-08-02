import React from 'react';
import Link from 'next/link';

interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className={`mt-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'} py-6`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">厳選シェアリングサービス</h3>
            <p className="text-sm">高品質な物件を厳選してご紹介します。</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">リンク</h3>
            <ul className="text-sm">
              <li className="mb-1"><Link href="/about" className="hover:underline">会社概要</Link></li>
              <li className="mb-1"><Link href="/terms" className="hover:underline">利用規約</Link></li>
              <li className="mb-1"><Link href="/privacy" className="hover:underline">プライバシーポリシー</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; 2023 Enabler DAO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
