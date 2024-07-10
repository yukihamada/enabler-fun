'use client';

import Link from 'next/link'
import Layout from '@/components/Layout'
import { FaUserTie, FaHandshake, FaRocket, FaClipboardList, FaUsers, FaHeadset, FaChartLine, FaClock, FaShieldAlt, FaStar, FaCheck } from 'react-icons/fa'
import { useState } from 'react';

export default function Employers() {
  const [showChat, setShowChat] = useState(false);

  return (
    <Layout>
      <main className="container mx-auto px-4 bg-gradient-to-b from-white to-blue-50 text-gray-900">
        <section className="py-16">
          <h1 className="text-6xl font-bold mb-8 text-center text-blue-800">料理人採用の新時代</h1>
          <p className="text-2xl mb-12 text-center max-w-3xl mx-auto">Chef Careerは、AIと人間の専門知識を組み合わせ、あなたの店舗に最適な料理人を見つけ出します。</p>
          
          <div className="bg-white shadow-lg rounded-lg p-8 mb-16">
            <h2 className="text-4xl font-semibold mb-8 text-center text-blue-700">なぜChef Careerなのか？</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <FaUserTie className="text-5xl mb-4 mx-auto text-blue-600" />
                <h3 className="text-2xl font-semibold mb-2">業界特化型人材プール</h3>
                <p>経験豊富な料理人のみを厳選。即戦力となる人材にアクセスできます。</p>
              </div>
              <div className="text-center">
                <FaHandshake className="text-5xl mb-4 mx-auto text-blue-600" />
                <h3 className="text-2xl font-semibold mb-2">AIマッチング技術</h3>
                <p>独自のアルゴリズムにより、あなたの店舗文化に合った候補者を提案します。</p>
              </div>
              <div className="text-center">
                <FaRocket className="text-5xl mb-4 mx-auto text-blue-600" />
                <h3 className="text-2xl font-semibold mb-2">迅速な採用プロセス</h3>
                <p>応募者管理から面接調整まで、採用にかかる時間を最大60%短縮します。</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8 mb-16">
            <h2 className="text-4xl font-semibold mb-8 text-center text-blue-700">充実のサービス内容</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <FaClipboardList />, text: "ターゲットを絞っ��求人掲載" },
                { icon: <FaUsers />, text: "AIを活用した応募者スクリーニング" },
                { icon: <FaHandshake />, text: "効率的な面接スケジューリング" },
                { icon: <FaRocket />, text: "採用戦略コンサルティング" },
                { icon: <FaHeadset />, text: "24時間サポート体制" },
                { icon: <FaChartLine />, text: "詳細な採用分析レポート" },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl text-blue-600">{item.icon}</div>
                  <span className="text-xl font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-4xl font-semibold mb-8 text-center text-blue-700">料金プラン</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <h3 className="text-2xl font-semibold mb-4 text-blue-800">ベーシックプラン</h3>
              <p className="text-4xl font-bold mb-6 text-blue-600">¥30,000<span className="text-xl font-normal">/月</span></p>
              <ul className="list-none mb-4">

                <li className="flex items-center mb-2"><FaCheck className="text-green-500 mr-2" /> 基本的な応募者管理</li>
                <li className="flex items-center mb-2"><FaCheck className="text-green-500 mr-2" /> メールサポート</li>
              </ul>
            </div>
            <div className="bg-blue-100 shadow-lg rounded-lg p-8 hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border-2 border-blue-500 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-blue-800 font-bold py-1 px-4 rounded-bl-lg">人気</div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-800">スタンダードプラン</h3>
              <p className="text-4xl font-bold mb-6 text-blue-600">¥50,000<span className="text-xl font-normal">/月</span></p>
              <ul className="list-none mb-4">

                <li className="flex items-center mb-2"><FaCheck className="text-green-500 mr-2" /> 高度な応募者管理</li>
                <li className="flex items-center mb-2"><FaCheck className="text-green-500 mr-2" /> 電話・メールサポート</li>
                <li className="flex items-center mb-2"><FaCheck className="text-green-500 mr-2" /> 採用活動コンサルティング</li>
              </ul>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <h3 className="text-2xl font-semibold mb-4 text-blue-800">プレミアムプラン</h3>
              <p className="text-4xl font-bold mb-6 text-blue-600">¥100,000<span className="text-xl font-normal">/月</span></p>
              <ul className="list-none mb-4">

                <li className="flex items-center mb-2"><FaCheck className="text-green-500 mr-2" /> VIP応募者管理</li>
                <li className="flex items-center mb-2"><FaCheck className="text-green-500 mr-2" /> 24時間サポート</li>
                <li className="flex items-center mb-2"><FaCheck className="text-green-500 mr-2" /> 採用戦略立案支援</li>
                <li className="flex items-center mb-2"><FaCheck className="text-green-500 mr-2" /> 人材育成プログラム</li>
              </ul>
            </div>
          </div>

          <div className="text-center mb-16">
            <button
              onClick={() => setShowChat(true)}
              className="bg-blue-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center space-x-2"
            >
              <FaRocket className="text-2xl" />
              <span>無料トライアルを始める</span>
            </button>
            <p className="mt-4 text-gray-600">14日間無料。契約不要。</p>
          </div>

          {showChat && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col relative">
                <button
                  onClick={() => setShowChat(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 bg-white rounded-full p-2 shadow-md transition duration-300 hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <iframe
                  src="https://udify.app/chatbot/u7yabuLbCIAlYhdV"
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="microphone"
                ></iframe>
              </div>
            </div>
          )}

          <div className="bg-white shadow-lg rounded-lg p-8 mb-16">
            <h2 className="text-4xl font-semibold mb-8 text-center text-blue-700">お客様の声</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="mb-4 italic">&quot;Chef Careerのおかげで、わずか2週間で最高のシェフを見つけることができました。AIマッチングの精度に驚きました！&quot;</p>
                <p className="font-semibold">- 田中 誠一, レストランオーナー</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="mb-4 italic">&quot;採用プロセスが大幅に効率化され、時間とコストの削減につながりました。Chef Careerは本当に素晴らしいサービスです。&quot;</p>
                <p className="font-semibold">- 佐藤 美香, 人事マネージャー</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-4xl font-semibold mb-4 text-center text-blue-700">お問い合わせ</h2>
            <p className="text-xl text-center mb-8">
              詳細については、<Link href="/contact" className="text-blue-600 hover:underline font-semibold">お問い合わせページ</Link>からお気にご連絡ください。専門のアドバイザーが丁寧にご対応いたします。
            </p>
          </div>
        </section>
      </main>
    </Layout>
  )
}
