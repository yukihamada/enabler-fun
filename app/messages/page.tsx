import Layout from '@/components/Layout'

export const metadata = {
  title: 'メッセージ - Chef Career',
  description: 'Chef Careerのメッセージページです。ユーザーのメッセージを表示します。',
}

export default function Messages() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">メッセージ</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">受信メッセージ</h2>
            <ul className="list-disc list-inside mb-8">
              <li>雇用主からのメッセージ1</li>
              <li>雇用主からのメッセージ2</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
