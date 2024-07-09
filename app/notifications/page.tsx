import Layout from '@/components/Layout'

export const metadata = {
  title: '通知 - Chef Career',
  description: 'Chef Careerの通知ページです。ユーザーの最新の通知を表示します。',
}

export default function Notifications() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">通知</h1>
          <div className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">最新の通知</h2>
            <ul className="list-disc list-inside mb-8">
              <li>新しい求人情報が追加されました。</li>
              <li>面接のスケジュールが更新されました。</li>
              <li>プロフィール情報が更新されました。</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
