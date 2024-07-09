"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">ダッシュボード</h1>
          {user && <h2 className="text-3xl mb-4">ようこそ、{user.displayName || user.email}さん</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">最近のアクティビティ</h2>
              <ul className="list-disc list-inside mb-8">
                <li>求人「焼肉古今」に応募しました。</li>
                <li>求人「中目黒 Bistro Bolero」に応募しました。</li>
                <li>プロフィール情報を更新しました。</li>
              </ul>
            </div>
            <div className="bg-gray-100 shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">通知</h2>
              <ul className="list-disc list-inside mb-8">
                <li>新しい求人情報が追加されました。</li>
                <li>面接のスケジュールが更新されました。</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
