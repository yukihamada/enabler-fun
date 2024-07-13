'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { signInWithPopup, GoogleAuthProvider, OAuthProvider, User } from 'firebase/auth'
import { auth, db, analytics } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { logEvent } from 'firebase/analytics'
import { FaGoogle } from 'react-icons/fa'
import { SiLine } from 'react-icons/si'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    try {
      const result = await signInWithPopup(auth, provider)
      await saveUserData(result.user)
      if (analytics) {
        logEvent(analytics, 'google_login')
      }
      router.push('/dashboard')
    } catch (error) {
      setError('Googleログインに失敗しました。')
    }
  }

  const handleLineLogin = async () => {
    const provider = new OAuthProvider('oidc.line')
    provider.addScope('profile')
    provider.addScope('openid')
    provider.setCustomParameters({
      prompt: 'consent',
      bot_prompt: 'normal'
    })
    try {
      const result = await signInWithPopup(auth, provider)
      await saveUserData(result.user)
      if (analytics) {
        logEvent(analytics, 'line_login')
      }
      router.push('/dashboard')
    } catch (error) {
      setError('LINEログインに失敗しました。')
    }
  }

  const saveUserData = async (user: User) => {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: user.providerData[0].providerId,
      lastLogin: new Date().toISOString(),
    }
    await setDoc(doc(db, 'users', user.uid), userData, { merge: true })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (error) {
      setError('登録に失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">会員登録</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          
          <div className="space-y-4 mb-8">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-3 text-lg hover:bg-gray-50 transition duration-300"
            >
              <FaGoogle className="mr-3 text-red-500" />
              Googleで登録
            </button>
            <button
              onClick={handleLineLogin}
              className="flex items-center justify-center w-full bg-[#00B900] text-white rounded-lg px-4 py-3 text-lg hover:bg-[#00a000] transition duration-300"
            >
              <SiLine className="mr-3" />
              LINEで登録
            </button>
          </div>

          <div className="relative mb-8">
            <hr className="border-gray-300" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-500">または</span>
          </div>

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">メールアドレス</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">パスワード</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? '登録中...' : 'メールアドレスで登録'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-gray-600">
            既にアカウントをお持ちですか？ <Link href="/login" className="text-blue-600 hover:underline">ログイン</Link>
          </p>
        </div>
      </main>
    </Layout>
  )
}