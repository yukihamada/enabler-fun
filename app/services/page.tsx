import Layout from '@/components/Layout'

export const metadata = {
  title: 'サービス - Chef Career',
  description: 'Chef Careerのサービスページです。提供しているサービスの詳細をご紹介します。',
}

export default function Services() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">サービス</h1>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-100 shadow-lg rounded-lg p-6 text-center">
              <h2 className="text-2xl font-semibold mb-4">求人情報提供</h2>
              <p>高級店からカジュアル店まで、多様な求人情報を提供します。</p>
            </div>
            <div className="bg-gray-100 shadow-lg rounded-lg p-6 text-center">
              <h2 className="text-2xl font-semibold mb-4">キャリアマッチング</h2>
              <p>経験豊富な料理人とのマッチングをサポートします。</p>
            </div>
            <div className="bg-gray-100 shadow-lg rounded-lg p-6 text-center">
              <h2 className="text-2xl font-semibold mb-4">キャリアアップ支援</h2>
              <p>経験豊富なアドバイザーによるキャリア相談を提供します。</p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
