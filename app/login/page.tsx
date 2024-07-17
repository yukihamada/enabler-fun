'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { FaGoogle } from 'react-icons/fa'
import { SiLine } from 'react-icons/si'

export default function Login() {
  const router = useRouter()

  const handleGoogleLogin = () => {
    const callbackUrl = `${window.location.origin}/api/auth/callback`;
    router.push(`/api/auth/login?connection=google-oauth2&redirect_uri=${encodeURIComponent(callbackUrl)}`);
  }

  const handleLineLogin = () => {
    const callbackUrl = `${window.location.origin}/api/auth/callback`;
    router.push(`/api/auth/login?connection=line&redirect_uri=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">ログイン</h1>
          
          <div className="space-y-4 mb-8">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-3 text-lg hover:bg-gray-50 transition duration-300"
            >
              <FaGoogle className="mr-3 text-red-500" />
              Googleでログイン
            </button>
            <button
              onClick={handleLineLogin}
              className="flex items-center justify-center w-full bg-[#00B900] text-white rounded-lg px-4 py-3 text-lg hover:bg-[#00a000] transition duration-300"
            >
              <SiLine className="mr-3" />
              LINEでログイン
            </button>
          </div>
          
          <p className="mt-6 text-center text-gray-600">
            アカウントをお持ちでないですか？ <Link href="/register" className="text-blue-600 hover:underline">会員登録</Link>
          </p>
        </div>
      </main>
    </Layout>
  )
}