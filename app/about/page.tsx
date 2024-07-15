import Image from 'next/image';
import Layout from '@/components/Layout';
import { FaHome, FaLaptop, FaPaintBrush } from 'react-icons/fa';

export const metadata = {
  title: 'イネブラについて - 民泊・簡易宿泊事業のデジタル化と空間プロデュースのパイオニア',
  description: 'イネブラは、民泊・簡易宿泊事業のデジタル化と空間プロデュースのパイオニアとして、物件管理やデジタル化支援、空間デザイン、運営サポートなどのサービスを提供しています。',
}

export default function AboutPage() {
  return (
    <Layout>
      <main className="bg-white text-gray-900">
        <section className="relative h-screen flex items-center justify-center">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2F8b049917f6f69cf2ebf10f32dfbafe75.JPG?alt=media&token=8b5c109c-f24c-40de-bdd5-3fa12b6510e5"
            alt="モダンな宿泊施設"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-6xl font-bold mb-4">イネブラが実現する<br/>宿泊事業の未来</h1>
            <p className="text-2xl mb-8">デジタル化と空間プロデュースで、新しい価値を創造</p>
            <a href="#mission" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-xl inline-block transition duration-300">
              私たちの想いを知る
            </a>
          </div>
        </section>

        <section id="mission" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Mission & Vision</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Faf0b1d14cc9f3301a4ce361af62c2cf3.webp?alt=media&token=f039852a-c1f3-4d0d-a9a8-c6b43825a994"
                  alt="ミッションイメージ"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg mb-4"
                />
                <h3 className="text-3xl font-semibold mb-4">Mission</h3>
                <p className="text-xl leading-relaxed">宿泊事業者の可能性を最大限に引き出し、デジタル化と空間プロデュースを通じて、魅力的な宿泊体験を創出します。私たちは、宿泊産業の発展に貢献し、旅行者と地域社会に新たな価値を提供します。</p>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Fc1bdd6a6a4d55cad234259acffc35d69.webp?alt=media&token=2556ec8f-4039-402a-aeec-defded250eb3"
                  alt="ビジョンイメージ"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg mb-4"
                />
                <h3 className="text-3xl font-semibold mb-4">Vision</h3>
                <p className="text-xl leading-relaxed">すべての宿泊施設が、テクノロジーと空間デザインの力を最大限に活用できる世界を目指します。イネブラを通じて、宿泊事業者が成功を収め、旅行者に忘れられない体験を提供し続けます。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">サービス詳細</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <FaHome className="text-6xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4">物件管理システム</h3>
                <ul className="text-left list-disc pl-5">
                  <li>予約管理の自動化</li>
                  <li>収益分析レポート</li>
                  <li>清掃スケジュール最適化</li>
                </ul>
              </div>
              <div className="text-center">
                <FaLaptop className="text-6xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4">デジタル化支援</h3>
                <ul className="text-left list-disc pl-5">
                  <li>スマートロックの導入</li>
                  <li>AIチャットボットの実装</li>
                  <li>オンラインチェックインシステム</li>
                </ul>
              </div>
              <div className="text-center">
                <FaPaintBrush className="text-6xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4">空間デザイン</h3>
                <ul className="text-left list-disc pl-5">
                  <li>地域性を活かしたインテリアデザイン</li>
                  <li>快適性と機能性の両立</li>
                  <li>写真映えするスポットの創出</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">お客様の声</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Ffdd5c8d3e1c89b2e4a6558a601f43513.webp?alt=media&token=801885fc-1690-499a-8cf3-6ff52d2d2143"
                  alt="お客様の声1"
                  width={400}
                  height={300}
                  className="rounded-lg mb-4"
                />
                <h3 className="text-2xl font-semibold mb-4">「イネブラのおかげで、宿泊施設の運営が劇的に改善しました」</h3>
                <p className="text-lg">イネブラの物件管理システムを導入してから、予約管理や収益分析が格段に効率化されました。デジタル化支援のおかげで、スタッフの業務負担も大幅に軽減されています。</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Ff4b8b1ee4a3282c4aa5e7bd04260ecc5.jpg?alt=media&token=fe806759-95ee-433a-a61b-af79559b299b"
                  alt="お客様の声2"
                  width={400}
                  height={300}
                  className="rounded-lg mb-4"
                />
                <h3 className="text-2xl font-semibold mb-4">「空間デザインで、宿泊者の満足度が向上しました」</h3>
                <p className="text-lg">イネブラの空間デザインサービスを利用して、宿泊施設の内装を一新しました。その結果、宿泊者からの評価が大幅に上がり、リピーター率も増加しています。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 relative">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/enabler-396600.appspot.com/o/image%2Fc67e975008be54e3fdc85c925333c7a2.webp?alt=media&token=2593548c-9dde-4c14-963a-c3eef5485cd8"
            alt="お問い合わせ背景"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-center text-white">お問い合わせ</h2>
            <form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  名前
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="あなたの名前"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  メールアドレス
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="あなたのメールアドレス"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                  メッセージ
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="message"
                  placeholder="あなたのメッセージ"
                  rows={4}
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  type="button"
                >
                  送信する
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">イネブラで、あなたの宿泊事業の未来を切り開こう</h2>
            <a href="/contact" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-xl inline-block">
              今すぐ相談する
            </a>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">会社情報</h2>
            <p className="text-xl mb-4">株式会社イネブラ</p>
            <p className="text-lg mb-2">濱田優貴</p>
            <p className="text-lg mb-4">所在地：東京都千代田区九段南１丁目６−５ 九段会館テラス ２F</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}