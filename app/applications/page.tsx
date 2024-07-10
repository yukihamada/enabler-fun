import Layout from '@/components/Layout'

export const metadata = {
  title: '応募情報 - Chef Career',
description: 'Chef Careerの応募情報ページです。ユーザーが応募した情報を表示します。'
}

export default function Applications() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">応募情報</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
<h2 className="text-2xl font-semibold mb-4">応募した情報</h2>
            <ul className="list-disc list-inside mb-8">
              <li>焼肉古今 - 応募情報</li>
              <li>中目黒 Bistro Bolero - 応募情報</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
