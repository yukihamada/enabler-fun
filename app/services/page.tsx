'use client';

import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { FaHome, FaLaptop, FaPaintBrush, FaChartLine, FaUserFriends, FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { ReactNode } from 'react';
import Image from 'next/image'

export default function Services() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout>
      <main className="bg-white text-gray-900">
        {/* ヘッダーセクション - パララックス効果付き */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Fcb663dc51f888d89b8720ecef09d0a3a.png?alt=media&token=2b56647f-c632-4be5-9ff3-51c130809d66"
            alt="ヘッダー画像"
            layout="fill"
            objectFit="cover"
            className="absolute z-0"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div className="relative z-10 text-white text-center bg-black bg-opacity-50 p-8 rounded-lg">
            <h1 className="text-6xl font-bold mb-8">イネブラのサービス</h1>
            <p className="text-2xl">民泊・簡易宿泊事業のデジタル化と空間プロデュースをトータルサポート</p>
          </div>
        </section>

        {/* サービス概要セクション - 画像とテキストの交互レイアウト */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">サービス概要</h2>
            <div className="space-y-20">
              <ServiceOverview
                title="物件管理システム"
                description="効率的な予約管理から収益分析まで、包括的な物件管理ソリューションを提供します。"
                imageSrc="https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Ff9680ef8e1c4f3742dfae4fecf16a6d8.webp?alt=media&token=cfcc2c62-a3cf-44d7-9046-8a2491c83a74"
                isReversed={false}
              />
              <ServiceOverview
                title="デジタル化支援"
                description="最新のテクノロジーを活用し、宿泊施��の運営をスマート化。業務効率を大幅に向上させます。"
                imageSrc="https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Ff4b8b1ee4a3282c4aa5e7bd04260ecc5.jpg?alt=media&token=fe806759-95ee-433a-a61b-af79559b299b"
                isReversed={true}
              />
              <ServiceOverview
                title="空間デザイン"
                description="魅的で快適な宿泊空間を創出。宿泊者の満足度を高め、リピーター獲得につなげます。"
                imageSrc="https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2F0d35ec0e7b4c6eb9414be6e954dfeb51.webp?alt=media&token=a76335e5-9c07-4182-ba12-ff3bba0f9848"
                isReversed={false}
              />
            </div>
          </div>
        </section>

        {/* 特徴セクション - 背景画像付き */}
        <section className="py-20 bg-fixed bg-cover bg-center" style={{backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Ffed2cf9ff8c256bbbc4abde188ca21a4.webp?alt=media&token=23e35b87-6f2b-4ba7-bcc1-a42b51c4e956')`}}>
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center text-white">サービスの特徴</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <FeatureCard
                icon={<FaChartLine className="text-4xl text-blue-600 mb-4" />}
                title="データ駆動型の意思決定支援"
                description="AIを活用した需要予測や価格最適化により、収益を最大化します。リアルタイムの市場動向分析で、戦略的な運営をサポートします。"
              />
              <FeatureCard
                icon={<FaUserFriends className="text-4xl text-blue-600 mb-4" />}
                title="カスタマーエクスペリエンスの向上"
                description="チャットボットやモバイルアプリを通じて、宿泊者とのコミュニケーションを円滑化。パーソナライズされたサービス提供で満足度を高めます。"
              />
            </div>
          </div>
        </section>

        {/* 導入事例セクション - カルーセル形式 */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">導入事例</h2>
            <CaseStudyCarousel />
          </div>
        </section>

        {/* CTAセクション - 背景画像付き */}
        <section className="py-20 bg-cover bg-center text-white" style={{backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2F887f9930b6b95a1b3227b396f52362de.jpeg?alt=media&token=85674f0a-1115-4d83-bc1c-44aba4bf3fed')`}}>
          <div className="container mx-auto px-4 text-center">
            <div className="bg-black bg-opacity-50 p-8 rounded-lg inline-block">
              <h2 className="text-4xl font-bold mb-8">イネブラのサービスで、あなたの宿泊事業を次のステージへ</h2>
              <a href="/contact" className="bg-white text-blue-600 hover:bg-blue-100 font-bold py-3 px-6 rounded-full text-xl inline-block transition duration-300">
                無料相談を予約する
              </a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

function ServiceOverview({ title, description, imageSrc, isReversed }: {
  title: string;
  description: string;
  imageSrc: string;
  isReversed: boolean;
}) {
  return (
    <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}>
      <div className="md:w-1/2">
        <Image src={imageSrc} alt={title} width={600} height={400} objectFit="cover" className="rounded-lg shadow-lg" />
      </div>
      <div className="md:w-1/2 mt-8 md:mt-0 md:px-8">
        <h3 className="text-3xl font-semibold mb-4">{title}</h3>
        <p className="text-xl">{description}</p>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-6">
      {icon}
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function CaseStudyCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const caseStudies = [
    {
      title: "都心の高級ホテル",
      description: "イネブラの物件管理システムとデジタル化支援により、予約率が30%向上し、顧客満足度が20%アップしました。",
      imageSrc: "https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Ffed2cf9ff8c256bbbc4abde188ca21a4.webp?alt=media&token=23e35b87-6f2b-4ba7-bcc1-a42b51c4e956"
    },
    {
      title: "地方の古民家宿",
      description: "空間デザインサービスを利用し、伝統的な雰囲気を残しつつモダンな快適性を実現。SNSでの話題性が高まり、若年層の集客に成功しました。",
      imageSrc: "https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2F887f9930b6b95a1b3227b396f52362de.jpeg?alt=media&token=85674f0a-1115-4d83-bc1c-44aba4bf3fed"
    }
  ];

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {caseStudies.map((study, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <Image src={study.imageSrc} alt={study.title} width={800} height={400} objectFit="cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">{study.title}</h3>
                  <p>{study.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => setCurrentSlide((prev) => (prev === 0 ? caseStudies.length - 1 : prev - 1))} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full">
        ←
      </button>
      <button onClick={() => setCurrentSlide((prev) => (prev === caseStudies.length - 1 ? 0 : prev + 1))} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full">
        →
      </button>
    </div>
  )
}