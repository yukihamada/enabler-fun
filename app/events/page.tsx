import Layout from '@/components/Layout'

export const metadata = {
  title: 'イベント情報 - Chef Career',
  description: 'Chef Careerのイベント情報ページです。最新のイベント情報を表示します。',
}

export default function Events() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">イベント情報</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">最新のイベント</h2>
            <ul className="list-disc list-inside mb-8">
              <li>イベント1 - 料理教室</li>
              <li>イベント2 - レストランツアー</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
