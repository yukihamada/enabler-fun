'use client';

import Layout from '@/components/Layout'
import { useState } from 'react'
import { FaHome, FaLaptop, FaPaintBrush, FaChartLine, FaUserFriends, FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { ReactNode } from 'react';

export default function Services() {
  return (
    <Layout>
      <main className="bg-white text-gray-900">
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-8 text-center">イネブラのサービス</h1>
            <p className="text-xl text-center mb-12">民泊・簡易宿泊事業のデジタル化と空間プロデュースをトータルサポート</p>
            <div className="grid md:grid-cols-3 gap-8">
              <ServiceCard
                icon={<FaHome className="text-5xl text-blue-600 mb-4" />}
                title="物件管理システム"
                description="効率的な予約管理から収益分析まで、包括的な物件管理ソリューションを提供します。"
                details={[
                  "一元化された予約管理システム",
                  "リアルタイムの在庫・料金管理",
                  "自動化された請求書発行と会計連携",
                  "詳細な収益レポートと分析ツール"
                ]}
              />
              <ServiceCard
                icon={<FaLaptop className="text-5xl text-blue-600 mb-4" />}
                title="デジタル化支援"
                description="最新のテクノロジーを活用し、宿泊施設の運営をスマート化。業務効率を大幅に向上させます。"
                details={[
                  "IoTデバイスによる施設管理の自動化",
                  "AIチャットボットによる24時間カスタマーサポート",
                  "デジタルチェックイン・チェックアウトシステム",
                  "クラウドベースの従業員管理ツール"
                ]}
              />
              <ServiceCard
                icon={<FaPaintBrush className="text-5xl text-blue-600 mb-4" />}
                title="空間デザイン"
                description="魅的で快適な宿泊空間を創出。宿泊者の満足度を高め、リピーター獲得につなげます。"
                details={[
                  "プロのインテリアデザイナーによる空間設計",
                  "地域の特性を活かしたユニークな内装提案",
                  "快適性と機能性を両立した家具選定",
                  "写真映えするスポット作りによるSNS効果の最大化"
                ]}
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">サービスの特徴</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <FeatureCard
                icon={<FaChartLine className="text-4xl text-blue-600 mb-4" />}
                title="データ駆動型の意思決定支援"
                description="AIを活用した需要予測や価格最適化により、収益を最大化します。リアルタイムの市場動向分析で、戦略的な運営をサポートします。"
              />
              <FeatureCard
                icon={<FaUserFriends className="text-4xl text-blue-600 mb-4" />}
                title="スタマーエクスペリエンスの向上"
                description="チャットボットやモバイルアプリを通じて、宿泊者とのコミュニケーションを円滑化。パーソナライズされたサービス提供で満足度を高めます。"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">導入事例</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <CaseStudyCard
                title="都心の高級ホテル"
                description="イネブラの物件管理システムとデジタル化支援により、予約率が30%向上し、顧客満足度が20%アップしました。"
              />
              <CaseStudyCard
                title="地方の古民家宿"
                description="空間デザインサービスを利用し、伝統的な雰囲気を残しつつモダンな快適性を実現。SNSでの話題性が高まり、若年層の集客に成功しました。"
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">イネブラのサービスで、あなたの宿泊事業を次のステージへ</h2>
            <a href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-xl inline-block transition duration-300">
              無料相談を予約する
            </a>
          </div>
        </section>
      </main>
    </Layout>
  )
}

function ServiceCard({ icon, title, description, details }: {
  icon: ReactNode;
  title: string;
  description: string;
  details: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
      {icon}
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="mb-4">{description}</p>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 hover:text-blue-800 transition duration-300 flex items-center justify-center w-full"
      >
        {isOpen ? '詳細を閉じる' : '詳細を見る'}
        {isOpen ? <FaAngleUp className="ml-2" /> : <FaAngleDown className="ml-2" />}
      </button>
      {isOpen && (
        <ul className="mt-4 text-left">
          {details.map((detail, index) => (
            <li key={index} className="mb-2">• {detail}</li>
          ))}
        </ul>
      )}
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
    <div className="bg-white shadow-lg rounded-lg p-6">
      {icon}
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

interface CaseStudyCardProps {
  title: string;
  description: string;
}

function CaseStudyCard({ title, description }: CaseStudyCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p>{description}</p>
    </div>
  )
}