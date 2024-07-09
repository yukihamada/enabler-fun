import Layout from '@/components/Layout'

export const metadata = {
  title: '面接スケジュール - Chef Career',
  description: 'Chef Careerの面接スケジュールページです。ユーザーの面接スケジュールを表示します。',
}

export default function Interviews() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">面接スケジュール</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">今後の面接</h2>
            <ul className="list-disc list-inside mb-8">
              <li>焼肉古今 - 2024年7月10日 14:00</li>
              <li>中目黒 Bistro Bolero - 2024年7月12日 10:00</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
