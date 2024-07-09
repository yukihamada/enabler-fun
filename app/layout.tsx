import '@/app/globals.css'
import Head from 'next/head'
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
      </Head>
      <body>
        {children}
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Enabler - 民泊・宿泊事業のデジタル化と空間プロデュース',
  description: 'Enablerは、民泊や簡易宿泊事業のデジタル化と空間プロデュースを行う会社です。IoTやAIを活用した革新的なソリューションで、宿泊施設の運営効率化と顧客体験の向上を実現します。',
  keywords: '民泊,簡易宿泊,デジタル化,空間プロデュース,IoT,AI,宿泊施設,運営効率化,顧客体験',
};
