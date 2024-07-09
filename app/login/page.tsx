import Link from 'next/link'
import Layout from '@/components/Layout'

export const metadata = {
  title: 'ログイン - Chef Career',
  description: 'Chef Careerのログインページです。既にアカウントをお持ちの方はこちらからログインしてください。',
}

export default function Login() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12 text-center">
          <h1 className="text-5xl font-bold mb-4">ログイン</h1>
          <p className="text-xl mb-8">既にアカウントをお持ちの方はこちらからログインしてください。</p>
          <form className="max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="email">メールアドレス</label>
              <input className="w-full px-4 py-2 border rounded" type="email" id="email" name="email" required />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="password">パスワード</label>
              <input className="w-full px-4 py-2 border rounded" type="password" id="password" name="password" required />
            </div>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition duration-300" type="submit">
              ログイン
            </button>
          </form>
          <p className="mt-4">
            アカウントをお持ちでないですか？ <Link href="/register" className="text-blue-600 hover:underline">会員登録</Link>
          </p>
        </section>
      </main>
    </Layout>
  )
}
