"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('ユーザー登録が成功しました！');
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('予期せぬエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12 text-center">
          <h1 className="text-5xl font-bold mb-4">会員登録</h1>
          <p className="text-xl mb-8">料理人としてのキャリアをスタートしましょう。</p>
          <form className="max-w-md mx-auto" onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="email">メールアドレス</label>
              <input
                className="w-full px-4 py-2 border rounded"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="password">パスワード</label>
              <input
                className="w-full px-4 py-2 border rounded"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition duration-300"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? '登録中...' : '登録する'}
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <p className="mt-4">
            既にアカウントをお持ちですか？ <Link href="/login" className="text-blue-600 hover:underline">ログイン</Link>
          </p>
        </section>
      </main>
    </Layout>
  );
}
