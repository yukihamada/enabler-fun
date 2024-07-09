import Layout from '@/components/Layout'

export const metadata = {
  title: '利用規約 - Chef Career',
  description: 'Chef Careerの利用規約ページです。サービスの利用に関する規約を記載しています。',
}

export default function Terms() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-white text-gray-900">
        <section className="py-12">
          <h1 className="text-5xl font-bold mb-8">利用規約</h1>
          <div className="max-w-2xl mx-auto">
            <p className="mb-8">この利用規約（以下、「本規約」といいます。）は、Chef Career（以下、「当社」といいます。）が提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆様（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。</p>
            <h2 className="text-2xl font-semibold mb-4">第1条（適用）</h2>
            <p className="mb-8">本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
            <h2 className="text-2xl font-semibold mb-4">第2条（利用登録）</h2>
            <p className="mb-8">登録希望者が当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。</p>
            <h2 className="text-2xl font-semibold mb-4">第3条（ユーザーIDおよびパスワードの管理）</h2>
            <p className="mb-8">ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。</p>
            <h2 className="text-2xl font-semibold mb-4">第4条（禁止事項）</h2>
            <p className="mb-8">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ul className="list-disc list-inside mb-8">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4">第5条（本サービスの提供の停止等）</h2>
            <p className="mb-8">当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断することができるものとします。</p>
            <ul className="list-disc list-inside mb-8">
              <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
              <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
              <li>コンピュータまたは通信回線等が事故により停止した場合</li>
              <li>その他、当社が本サービスの提供が困難と判断した場合</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}
