'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout'; // Layout component imported
import { FaSearch, FaHome, FaChartLine, FaBriefcase, FaUsers, FaLaptop, FaPaintBrush, FaHandsHelping } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const images = [
  '/images/property1.jpg',
  '/images/property2.jpg',
  '/images/property3.jpg'
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <main className="bg-white text-gray-900 flex-grow">
          <section className="relative h-screen flex items-center justify-center bg-cover bg-center transition-all duration-1000 ease-in-out" style={{backgroundImage: `url(${images[currentImageIndex]})`}}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 text-center text-white px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">イネブラ（Enabler）</h1>
              <p className="text-xl md:text-2xl mb-8">民泊・簡易宿泊事業のデジタル化と空間プロデュースのパイオニア</p>
              <div className="space-x-4">
                <Link href="/properties" className="btn-primary inline-block">
                  物件を探す
                </Link>
                <Link href="/services" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-[rgb(var(--primary-color))] transition duration-300 inline-block mt-4 md:mt-0">
                  サービス詳細
                </Link>
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">注目の物件</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
                <Image src="/images/property1.jpg" alt="モダンアパートメント" width={600} height={400} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">モダンアパートメト - 渋谷区</h3>
                  <p className="mb-4">都心の便利な立地に位置する、スタイリッシュな1LDK。最新のスマートホーム機能を完備。</p>
                  <ul className="list-disc list-inside mb-4">
                    <li>スマートロック搭載</li>
                    <li>高速Wi-Fi完備</li>
                    <li>24時間セキュリティ</li>
                  </ul>
                  <Link href="/properties/modern-apartment" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 inline-block">
                    詳細を見る
                  </Link>
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
                <Image src="/images/property2.jpg" alt="伝統的な町家" width={600} height={400} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">伝統的な町家 - 京都市</h3>
                  <p className="mb-4">京都の風情を感じられる、改装済みの町家。現代的な設備と伝統的な雰囲気が融合。</p>
                  <ul className="list-disc list-inside mb-4">
                    <li>庭園付</li>
                    <li>茶室完備</li>
                    <li>観光名所へのアクセス良好</li>
                  </ul>
                  <Link href="/properties/kyoto-townhouse" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 inline-block">
                    詳細を見る
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link href="/properties" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition duration-300">
                すべての物件を見る
              </Link>
            </div>
          </section>

          <section className="py-16 px-4 bg-gray-50">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">イネブラのサービス</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { name: '物件管理', icon: FaHome, description: '効率的な物件管理システムで、オーナー様の負担を軽減します。' },
                { name: 'デジタル化支援', icon: FaLaptop, description: '最新のテクノロジーを活用し、予約管理や顧客対応を効率化します。' },
                { name: '空間デザイン', icon: FaPaintBrush, description: '魅力的で快適な空間づくりで、宿泊者の満足度を高めます。' },
                { name: '運営サポート', icon: FaHandsHelping, description: '法規制対応から集客まで、運営全般をサポートします。' }
              ].map((service) => (
                <div key={service.name} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 text-center">
                  {React.createElement(service.icon, { className: "text-4xl mb-4 mx-auto text-blue-600" })}
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">イネブラ（Enabler）の強み</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg">
                <FaChartLine className="text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">収益最大化</h3>
                <p>データ分析と市場トレンドを活用し、物件の収益を最大化します。</p>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg">
                <FaLaptop className="text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">デジタル化支援</h3>
                <p>最新のテクノロジーを導入し、運営の効率化と顧客体験の向上を実現します。</p>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg">
                <FaPaintBrush className="text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">空間デザイン</h3>
                <p>魅力的で機能的な空間づくりで、宿泊者の満足度を高めます。</p>
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <h2 className="text-3xl font-semibold mb-12 text-center">お客様の声</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-100 p-8 rounded-lg shadow-md relative">
                <Image src="/images/testimonial-1.jpg" alt="山田 太郎" width={80} height={80} className="rounded-full absolute -top-4 -left-4 border-4 border-white" />
                <p className="mb-4 italic">&ldquo;イネブラのサポートのおかげで、私の物件の稼働率が大幅に向上しました。デジタルの導入も円滑で、運営の効率が格段に上がりました。&rdquo;</p>
                <p className="font-semibold">- 山田 太郎, 45歳</p>
                <p className="text-sm text-gray-600">アパートメント所有者</p>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg shadow-md relative">
                <Image src="/images/testimonial-2.jpg" alt="鈴木 花子" width={80} height={80} className="rounded-full absolute -top-4 -left-4 border-4 border-white" />
                <p className="mb-4 italic">&ldquo;イネブラの空間デザインサービスを利用して、古い町家を素敵な宿泊施設にリノベーションできました。予約が殺到するほどの人気物件になりました。&rdquo;</p>
                <p className="font-semibold">- 鈴木 花子, 38歳</p>
                <p className="text-sm text-gray-600">町家オーナー</p>
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-gray-100">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-semibold mb-8">お問い合わせ</h2>
              <p className="text-xl mb-8">民泊・簡易宿泊事業でのお悩みやご相談は、お気軽にイネブラまでご連絡ください</p>
              <Link href="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition duration-300 inline-block">
                お問い合わせはこちら
              </Link>
            </div>
          </section>
        </main>
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">イネブラ（Enabler）</h3>
                <p>民泊・簡易宿泊事業のデジタル化と空間プロデュースのパイオニア</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">サービス</h3>
                <ul>
                  <li><Link href="/services#property-management">物件管理</Link></li>
                  <li><Link href="/services#digitalization">デジタル化支援</Link></li>
                  <li><Link href="/services#space-design">空間デザイン</Link></li>
                  <li><Link href="/services#operation-support">運営サポート</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">会社情報</h3>
                <ul>
                  <li><Link href="/about">会社概要</Link></li>
                  <li><Link href="/team">チーム</Link></li>
                  <li><Link href="/careers">採用情報</Link></li>
                  <li><Link href="/news">ニュース</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">お問い合わせ</h3>
                <p>〒123-4567<br />東京都渋谷区○○1-2-3</p>
                <p>TEL: 03-1234-5678</p>
                <p>Email: info@enabler.co.jp</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center">
              <p>&copy; 2024 イネブラ（Enabler）. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}