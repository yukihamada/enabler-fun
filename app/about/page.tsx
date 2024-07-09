import Image from 'next/image';
import Layout from '@/components/Layout';
import { FaUtensils, FaGraduationCap, FaHandshake } from 'react-icons/fa';

export const metadata = {
  title: 'Chef Careerについて - 料理人の夢を叶えるキャリアプラットフォーム',
  description: 'Chef Careerは、一流の料理人を目指す方々のキャリアを全面的にサポート。豊富な求人情報、専門家によるキャリアアドバイス、スキルアップセミナーで、あなたの料理人としての未来を切り開きます。',
}

export default function AboutPage() {
  return (
    <Layout>
      <main className="bg-white text-gray-900">
        <section className="relative h-screen flex items-center justify-center">
          <Image
            src="/images/hero-kitchen.jpg"
            alt="プロの厨房"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-6xl font-bold mb-4">Chef Careerが叶える<br/>料理人の夢</h1>
            <p className="text-2xl mb-8">あなたの情熱と技術を最高の舞台へ</p>
            <a href="#mission" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-xl inline-block transition duration-300">
              私たちの想いを知る
            </a>
          </div>
        </section>

        <section id="mission" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Mission & Vision</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h3 className="text-3xl font-semibold mb-4">Mission</h3>
                <p className="text-xl leading-relaxed">料理人一人ひとりの才能と情熱を最大限に引き出し、彼らが理想の職場で活躍できるよう支援します。私たちは、料理人のキャリアをサポートすることで、日本の食文化の発展に貢献します。</p>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <h3 className="text-3xl font-semibold mb-4">Vision</h3>
                <p className="text-xl leading-relaxed">すべての料理人が、自身の可能性を最大限に発揮できる環境で働けるような世界を目指します。Chef Careerを通じて、料理人が夢を追求し、成功を収めるための道筋を提供し続けます。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">私たちの強み</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <FaUtensils className="text-6xl text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4">豊富な求人情報</h3>
                <p className="text-lg">ミシュラン星付きレストランから人気居酒屋まで、幅広い求人を掲載。あなたにぴったりの職場が見つかります。</p>
              </div>
              <div className="text-center">
                <FaGraduationCap className="text-6xl text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4">スキルアップ支援</h3>
                <p className="text-lg">一流シェフによるオンラインセミナや技術講習会を定期開催。常に最新のスキルを習得できます。</p>
              </div>
              <div className="text-center">
                <FaHandshake className="text-6xl text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4">キャリアサポート</h3>
                <p className="text-lg">経験豊富なキャリアアドバイザーが、あなたの目標に合わせたキャリアプランを提案します。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">お客様の声</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">「Chef Careerのおかげで、夢の職場を見つけることができました」</h3>
                <p className="text-lg">料理人としてのキャリアをスタートするにあたって、Chef Careerのサポートが大いに役立ったです。豊富な求人情報と、キャリアアドバイスのおかげで、理想の職場を見つけることができました。</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">「スキルアップセミナーで、技術を磨くことができました」</h3>
                <p className="text-lg">Chef Careerのスキルアップセミナーに参加して、最新の料理技術を学ぶことができました。セミナーの内容は非常に充実しており、実践に役立つ知識を得ることができました。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">お問い合わせ</h2>
            <form className="max-w-lg mx-auto">
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
            <h2 className="text-4xl font-bold mb-8">Chef Careerで、あなたの料理人としての未来を切り開こう</h2>
            <a href="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-xl inline-block">
              今すぐ登録する
            </a>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">会社情報</h2>
            <p className="text-xl mb-4">株式会社イネブラ</p>
            <p className="text-lg mb-2">代表取締役：Enabler 濱田優貴</p>
            <p className="text-lg mb-4">所在地：東京都千代田区九段南１丁目６−５ 九段会館テラス ２F</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}