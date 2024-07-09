import Layout from '@/components/Layout'

export const metadata = {
  title: 'ブログ - Chef Career',
  description: 'Chef Careerのブログページです。最新のブログ記事を表示します。',
}

export default function Blog() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">ブログ</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">最新のブログ記事</h2>
            <ul className="list-disc list-inside mb-8">
              <li>記事1 - 料理のコツ</li>
              <li>記事2 - レストランレビュー</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
