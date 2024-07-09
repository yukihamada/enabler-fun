import Layout from '@/components/Layout'

export const metadata = {
  title: 'ユーザーの声 - Chef Career',
  description: 'Chef Careerのユーザーの声ページです。ユーザーの体験談を表示します。',
}

export default function Testimonials() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">ユーザーの声</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">体験談</h2>
            <ul className="list-disc list-inside mb-8">
              <li>ユーザーA: Chef Careerを通じて理想の職場を見つけました。</li>
              <li>ユーザーB: キャリアアップのサポートがとても役立ちました。</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
