import Layout from '@/components/Layout'
import { FaQuestionCircle } from 'react-icons/fa'

export const metadata = {
  title: 'よくある質問 - Chef Career',
  description: 'Chef Careerのよくある質問ページです。ユーザーから寄せられる質問とその回答を掲載しています。',
}
const faqItems = [
  {
    question: "Chef Careerとは何ですか？",

  },
  {
    question: "会員登録は無料ですか？",

  },
  {


  },
  {
    question: "キャリア相談はどのように行われますか？",
    answer: "経験豊富なアドバイザーが、あなたのキャリアに関する相談に応じます。オンラインでの相談も可能ですので、お気軽にお問い合わせください。面談では、あなたのスキルや経験、希望するキャリアパスについて詳しくヒアリングし、最適なアドバイスを提供します。"
  },
  {

answer: "気になるポジションを見つけたら、詳細ページの「応募する」ボタンをクリックしてください。履歴書や職務経歴書の提出が必要な場合は、オンラインフォームから簡単にアップロードできます。応募後は、担当者からの連絡をお待ちください。"
  },
  {
    question: "Chef Careerを利用するメリットは何ですか？",
    answer: "Chef Careerの主なメリットは以下の通りです：\n1. 豊富な求人情報：幅広いジャンルと経験レベルの求人を掲載\n2. キャリアサポート：経験豊富なアドバイザーによる無料相談\n3. スキルアップ支援：料理人向けのセミナーや講座の情報提供\n4. コミュニティ：同業者とのネットワーキングの機会\n5. 使いやすさ：直感的なインターフェースで簡単に求人検索・応募が可能"
  },
  {
    question: "求人情報はどのくらいの頻度で更新されますか？",
    answer: "求人情報は毎日更新されています。新しい求人は随時追加され、既に採用が決まった求人は速やかに削除されます。最新の情報を常にチェックすることをおすすめします。"
  },
  {
    question: "経験の浅い料理人でも利用できますか？",
    answer: "はい、経験の浅い料理人の方も大歓迎です。Chef Careerでは、新人からベテランまで、様々な経験レベルに合わせた求人を掲載しています。また、キャリアアドバイザーが適切なアドバイスを提供し、あなたのキャリアアップをサポートします。"
  },
  {
    question: "海外の求人情報もありますか？",
    answer: "はい、国内の求人だけでなく、海外の求人情報も掲載しています。海外で経験を積みたい方や、グローバルなキャリアを目指す方にも適した情報を提供しています。"
  },
  {
    question: "求人に応募した後、結果はどのように通知されますか？",
    answer: "応募結果は、通常、企業から直接連絡があります。Chef Careerのメッセージシステムを通じて連絡が来る場合もあります。応募状況は、マイページで確認することができます。"
  },
  {
    question: "Chef Careerではどのようなサポートが受けられますか？",
    answer: "Chef Careerでは、求人情報の提供だけでなく、キャリアアドバイスやスキルアップのためのセミナー情報、履歴書の書き方のアドバイスなど、さまざまなサポートを受けることができます。"
  },
  {
    question: "Chef Careerの利用はどのような人に向いていますか？",
    answer: "Chef Careerは、料理人としてのキャリアを追求したいすべての方に向いています。新しいチャレンジを探している方、キャリアアップを目指している方、またはスキルを磨きたい方など、さまざまなニーズに対応しています。"
  },
  {
    question: "Chef Careerを利用するための条件はありますか？",
    answer: "特別な条件はありません。料理に情熱を持っている方であれば、誰でも利用できます。新卒の方からベテランの方まで、幅広い層の方々にご利用いただいています。"
  }
];
export default function FAQ() {
  return (
    <Layout>
      <main className="container mx-auto px-4 bg-gradient-to-b from-white to-gray-100 text-gray-900 min-h-screen">
        <section className="py-16">
          <h1 className="text-5xl font-bold mb-12 text-center text-indigo-600">よくある質問</h1>
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
            {faqItems.map((item, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <h2 className="text-2xl font-semibold mb-3 flex items-center text-indigo-700">
                  <FaQuestionCircle className="mr-3 text-indigo-500" />
                  {item.question}
                </h2>
                <p className="text-lg text-gray-700 pl-9">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}
