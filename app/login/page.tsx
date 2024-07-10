'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard') // ログイン後のリダイレクト先
    } catch (error) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
    }
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12 text-center">
          <h1 className="text-5xl font-bold mb-4">ログイン</h1>
          <p className="text-xl mb-8">既にアカウントをお持ちの方はこちらからログインしてください。</p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form className="max-w-md mx-auto" onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="email">メールアドレス</label>
              <input
                className="w-full px-4 py-2 border rounded"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="password">パスワード</label>
              <input
                className="w-full px-4 py-2 border rounded"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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