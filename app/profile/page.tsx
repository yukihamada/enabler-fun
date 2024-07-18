import { getSession } from '@auth0/nextjs-auth0';
import Layout from '@/components/Layout'
import { FaUser, FaEnvelope, FaClock, FaUserCog, FaEdit } from 'react-icons/fa';
import Link from 'next/link';

export const metadata = {
  title: 'プロフィール - イネブラ',
  description: 'イネブラのプロフィールページです。ユーザー情報の確認と管理ができます。',
}

export default async function Profile() {
  const session = await getSession();
  const user = session?.user;
  const roles: string[] = user?.app_metadata?.authorization?.roles || [];
  const isAdmin = roles.includes('admin');

  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8 text-center">マイプロフィール</h1>
          {user ? (
            <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden">
              <div className="bg-blue-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  {user.picture ? (
                    <img src={user.picture} alt="プロフィール画像" className="w-24 h-24 rounded-full border-4 border-white" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl">
                      <FaUser />
                    </div>
                  )}
                  <div>
                    <h2 className="text-3xl font-semibold">{user.name || 'ユーザー名'}</h2>
                    <p className="text-xl">{user.nickname || '未設定'}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-blue-600" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock className="text-blue-600" />
                  <span>最終ログイン: {new Date(user.updated_at).toLocaleString('ja-JP')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUserCog className="text-blue-600" />
                  <span>ユーザー権限: {isAdmin ? (
                    <span className="text-green-600 font-semibold">管理者</span>
                  ) : (
                    <span className="text-blue-600">一般ユーザー</span>
                  )}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">ロール</h3>
                  <ul className="list-disc list-inside">
                    {roles.map((role: string, index: number) => (
                      <li key={index} className="capitalize">{role}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">自己紹介</h3>
                  <p className="bg-white p-4 rounded">{user.description || '自己紹介が設定されていません。'}</p>
                </div>
                <div className="flex space-x-4">
                  <Link href="/profile/edit" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                    <FaEdit className="mr-2" />
                    プロフィール編集
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300">
                      <FaUserCog className="mr-2" />
                      管理画面
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">ログインしていません。プロフィールを表示するにはログインしてください。</p>
              <Link href="/api/auth/login" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300">
                ログイン
              </Link>
            </div>
          )}
        </section>
      </main>
    </Layout>
  )
}