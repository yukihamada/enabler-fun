import Layout from '@/components/Layout'

export const metadata = {
  title: 'サポート - Chef Career',
  description: 'Chef Careerのサポートページです。ユーザーがサポートを受けるための情報を提供します。',
}

export default function Help() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">サポート</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">よくある質問</h2>
            <ul className="list-disc list-inside mb-8">
              <li>Q: Chef Careerとは何ですか？</li>
              <li>A: Chef Careerは、料理人のためのキャリアマッチングプラットフォームです。</li>
              <li>Q: 会員登録は無料ですか？</li>
              <li>A: はい、会員登録は無料です。</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4">お問い合わせ</h2>
            <p className="mb-8">詳細については、お問い合わせページからご連絡ください。</p>
          </div>
        </section>
      </main>
    </Layout>
  )
}
