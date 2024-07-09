import Layout from '@/components/Layout'

export const metadata = {
  title: 'アカウント設定 - Chef Career',
  description: 'Chef Careerのアカウント設定ページです。ユーザーがアカウント情報を変更できます。',
}

export default function Settings() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">アカウント設定</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
            <form>
              <div className="mb-4">
                <label className="block text-left mb-2" htmlFor="name">名前</label>
                <input className="w-full px-4 py-2 border rounded" type="text" id="name" name="name" defaultValue="ユーザー名" required />
              </div>
              <div className="mb-4">
                <label className="block text-left mb-2" htmlFor="email">メールアドレス</label>
                <input className="w-full px-4 py-2 border rounded" type="email" id="email" name="email" defaultValue="user@example.com" required />
              </div>
              <div className="mb-4">
                <label className="block text-left mb-2" htmlFor="password">新しいパスワード</label>
                <input className="w-full px-4 py-2 border rounded" type="password" id="password" name="password" />
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition duration-300" type="submit">
                保存する
              </button>
            </form>
          </div>
        </section>
      </main>
    </Layout>
  )
}
