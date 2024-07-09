import Layout from '@/components/Layout'

export const metadata = {
  title: 'プライバシーポリシー - Chef Career',
  description: 'Chef Careerのプライバシーポリシーページです。ユーザーの個人情報の取り扱いについて説明します。',
}

export default function Privacy() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">プライバシーポリシー</h1>
          <div className="max-w-2xl mx-auto">
            <p className="mb-8">Chef Career（以下、「当社」といいます。）は、ユーザーの個人情報の保護に関する法律（以下、「個人情報保護法」といいます。）を遵守し、ユーザーの個人情報を適切に取り扱います。</p>
            <h2 className="text-2xl font-semibold mb-4">第1条（個人情報の定義）</h2>
            <p className="mb-8">個人情報とは、生存する個人に関する情報であって、氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別することができる情報を指します。</p>
            <h2 className="text-2xl font-semibold mb-4">第2条（個人情報の収集方法）</h2>
            <p className="mb-8">当社は、ユーザーが利用登録をする際に氏名、メールアドレス、電話番号等の個人情報をお尋ねすることがあります。</p>
            <h2 className="text-2xl font-semibold mb-4">第3条（個人情報の利用目的）</h2>
            <p className="mb-8">当社は、個人情報を以下の目的で利用します。</p>
            <ul className="list-disc list-inside mb-8">
              <li>サービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
              <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため</li>
              <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
              <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
              <li>ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
              <li>上記の利用目的に付随する目的</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
