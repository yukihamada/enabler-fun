'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function AdminStorage() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const listFiles = useCallback(async () => {
    // listFiles implementation
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (session) {
        await listFiles() // セッションがある場合のみファイル一覧を取得
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        listFiles() // セッションが変更されたときにファイル一覧を更新
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, listFiles]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // ログイン成功後、セッションを更新
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    } catch (error) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
    }
  }

  return (
    <>
      <Header />
      <main className="admin-container max-w-full px-4">
        <h1 className="text-2xl font-bold mb-4">ストレージ管理</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!session ? (
          <form className="mb-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-2 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2 p-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              ログイン
            </button>
          </form>
        ) : (
          <>
            {/* ファイルアップロードと管理のUI */}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}