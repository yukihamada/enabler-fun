'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout'; // Layout component imported
import { FaSearch, FaHome, FaChartLine, FaBriefcase, FaUsers, FaLaptop, FaPaintBrush, FaHandsHelping } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

const images = [
  'https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Fd46e0678579e6790a7f86931b0fa1478.webp?alt=media&token=dbe025fd-1004-4637-bc06-a3f3c7031d7d',
  'https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2F4b77acbc70be968a98df75043c936787.webp?alt=media&token=2caa8a11-8b03-4f6e-93b9-7f18113624a4',
  'https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2F8b049917f6f69cf2ebf10f32dfbafe75.JPG?alt=media&token=8b5c109c-f24c-40de-bdd5-3fa12b6510e5',
  'https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Faf0b1d14cc9f3301a4ce361af62c2cf3.webp?alt=media&token=f039852a-c1f3-4d0d-a9a8-c6b43825a994',
  'https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Fc1bdd6a6a4d55cad234259acffc35d69.webp?alt=media&token=2556ec8f-4039-402a-aeec-defded250eb3',
  'https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Ffdd5c8d3e1c89b2e4a6558a601f43513.webp?alt=media&token=801885fc-1690-499a-8cf3-6ff52d2d2143',
  'https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Ff4b8b1ee4a3282c4aa5e7bd04260ecc5.jpg?alt=media&token=fe806759-95ee-433a-a61b-af79559b299b',
  'https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Fc67e975008be54e3fdc85c925333c7a2.webp?alt=media&token=2593548c-9dde-4c14-963a-c3eef5485cd8',
  'https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Fdec69e9042e4667e61dd537ab953ccdf.webp?alt=media&token=d0855b16-6cfc-4a76-9bd0-f7bafc952e7b'
];

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  imageUrls: string[] | string;
  description: string;
}

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const propertiesCollection = collection(db, 'properties');
        const propertiesQuery = query(propertiesCollection, limit(20)); // 20件取得して、その中からランダムに6件選ぶ
        const propertiesSnapshot = await getDocs(propertiesQuery);
        const propertiesList = propertiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Property));
        
        // ランダムに6件選択
        const shuffled = propertiesList.sort(() => 0.5 - Math.random());
        setFeaturedProperties(shuffled.slice(0, 6));
      } catch (error) {
        console.error('物件の取得に失敗しました:', error);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const filterProperties = (category: string) => {
    setActiveTab(category);
    // ここで物件のフィルタリングロジックを実装
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <Head>
          <title>イネブラ（Enabler） - 民泊・簡易宿泊事業のデジタル化と空間プロデュース</title>
          <meta name="description" content="イネブラは、民泊・簡易宿泊事業のデジタル化と空間プロデュースを行う企業です。物件管理、デジタル化支援、空間デザイン、運営サポートなど、幅広いサービスを提供しています。" />
          <meta name="keywords" content="民泊, 簡易宿泊, デジタル化, 空間プロデュース, 物件管理, イネブラ, Enabler" />
        </Head>
        <main className="bg-white text-gray-900 flex-grow">
          <section className="relative h-screen flex items-center justify-center bg-cover bg-center transition-all duration-1000 ease-in-out">
            <Image 
              src={images[currentImageIndex]} 
              alt="ヒーロー画像" 
              layout="fill" 
              objectFit="cover" 
              priority
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 text-center text-white px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">イネブラ（Enabler）</h1>
              <p className="text-xl md:text-2xl mb-8">民泊・簡易宿泊事業のデジタル化と空間プロデュースのパイオニア</p>
              <div className="space-x-4">
                <Link href="/properties" className="btn-primary inline-block" aria-label="物件を探す">
                  物件を探す
                </Link>
                <Link href="/services" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-blue-600 transition duration-300 inline-block mt-4 md:mt-0">
                  サービス詳細
                </Link>
                <Link href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg hover:bg-blue-100 transition duration-300 inline-block mt-4 md:mt-0">
                  お問い合わせ
                </Link>
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">注目の物件</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredProperties.map((property) => (
                <div key={property.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
                  <Image 
                    src={Array.isArray(property.imageUrls) ? property.imageUrls[0] : property.imageUrls} 
                    alt={property.title} 
                    width={600} 
                    height={400} 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-4">{property.title}</h3>
                    <p className="mb-4">{property.address}</p>
                    <p className="mb-4 line-clamp-3">{property.description}</p>
                    <Link href={`/properties/${property.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 inline-block">
                      詳細を見る
                    </Link>
                  </div>
                </div>
              ))}
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
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link href={`/services#${service.name}`} className="text-blue-600 hover:underline">
                    詳細を見る
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/services" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition duration-300">
                すべてのサービスを見る
              </Link>
            </div>
          </section>

          <section className="py-16 px-4 bg-white">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">イネブラの強み</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">豊富な経験</h3>
                <p className="text-gray-600">多数の物件管理実績と、業界をリードする専門知識を持つ経豊富なチーム</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">革新的なテクノロジー</h3>
                <p className="text-gray-600">最新のデジタルツールとAIを活用し、効率的な運営と顧客満足度の向上を実現</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">カスタマズされたソリューション</h3>
                <p className="text-gray-600">各物件のユニークなニーズに合わせた、柔軟かつ効果的なサービス提供</p>
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-gray-100">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">お客様の声</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">&quot;イネブラのサービスのおかげで、物件の稼働率が大幅に向上しました。プロフェッショナルなサポートに感謝しています。&quot;</p>
                <p className="font-semibold">田中 様 - 東京都内の物件オーナー</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">&quot;デジタル化支援により、予約管理が格段に楽になりました。顧客満足度も上がり、リピーターが増えています。&quot;</p>
                <p className="font-semibold">佐藤 様 - 京都市内の町家オーナー</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">&quot;空間デザインのアドバイスが素晴らしかったです。お客様からの評価も上がり、SNSでの口コミも増えました。&quot;</p>
                <p className="font-semibold">鈴木 様 - 沖縄のヴィラオーナー</p>
              </div>
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
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center">お問い合わせ</h2>
              <p className="text-xl mb-8 text-center">民泊・簡易宿泊事業でのお悩みやご相談は、お気軽にイネブラまでご連絡ください</p>
              <form className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">お名前</label>
                  <input type="text" id="name" name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">メールアドレス</label>
                  <input type="email" id="email" name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">メッセージ</label>
                  <textarea id="message" name="message" rows={4} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
                </div>
                <div className="flex items-center justify-between">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
                    送信する
                  </button>
                </div>
              </form>
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
      {showNewsletter && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p>最新情報を受け取りませんか？</p>
            <input 
              type="email" 
              placeholder="メールアドレスを入力" 
              className="px-4 py-2 text-gray-900"
            />
            <button className="bg-white text-blue-600 px-4 py-2">登録</button>
            <button onClick={() => setShowNewsletter(false)}>✕</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
