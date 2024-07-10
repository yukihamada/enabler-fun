import Layout from '@/components/Layout'

export const metadata = {
  title: 'お気に入り - Chef Career',
description: 'Chef Careerのお気に入りページです。ユーザーが保存したお気に入りの情報を表示します。'
}

export default function Favorites() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">お気に入り</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
<h2 className="text-2xl font-semibold mb-4">保存した情報</h2>
            <ul className="list-disc list-inside mb-8">

            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
