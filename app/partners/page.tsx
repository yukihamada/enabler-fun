import Layout from '@/components/Layout'

export const metadata = {
  title: '提携企業 - Chef Career',
  description: 'Chef Careerの提携企業ページです。提携している企業やパートナーの情報を表示します。',
}

export default function Partners() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">提携企業</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">提携企業一覧</h2>
            <ul className="list-disc list-inside mb-8">
              <li>企業A - 高級レストランチェーン</li>
              <li>企業B - 食材供給会社</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
