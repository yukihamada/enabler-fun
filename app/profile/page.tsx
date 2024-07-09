import Layout from '@/components/Layout'

export const metadata = {
  title: 'プロフィール - Chef Career',
  description: 'Chef Careerのプロフィールページです。ユーザーのプロフィール情報を表示します。',
}

export default function Profile() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">プロフィール</h1>
          <div className="max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">ユーザー名</h2>
            <p className="mb-4">メールアドレス: user@example.com</p>
            <p className="mb-4">登録日: 2023-01-01</p>
            <h3 className="text-xl font-semibold mb-2">自己紹介</h3>
            <p className="mb-4">料理が大好きで、特に和食に情熱を持っています。新しいレシピを試すのが趣味です。</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
              プロフィール編集
            </button>
          </div>
        </section>
      </main>
    </Layout>
  )
}
