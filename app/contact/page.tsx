import Layout from '@/components/Layout'

export const metadata = {
  title: 'お問い合わせ - Chef Career',
  description: 'Chef Careerへのお問い合わせページです。ご質問やご意見がございましたら、こちらからお問い合わせください。',
}

export default function Contact() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12 text-center">
          <h1 className="text-5xl font-bold mb-4">お問い合わせ</h1>
          <p className="text-xl mb-8">ご質問やご意見がございましたら、以下のフォームからお問い合わせください。</p>
          <form className="max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="name">名前</label>
              <input className="w-full px-4 py-2 border rounded" type="text" id="name" name="name" required />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="email">メールアドレス</label>
              <input className="w-full px-4 py-2 border rounded" type="email" id="email" name="email" required />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-2" htmlFor="message">メッセージ</label>
              <textarea className="w-full px-4 py-2 border rounded" id="message" name="message" rows={4} required></textarea>
            </div>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition duration-300" type="submit">
              送信
            </button>
          </form>
        </section>
      </main>
    </Layout>
  )
}
