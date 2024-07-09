export const metadata = {
  title: '雇用主の方へ - Chef Career',
  description: 'Chef Careerの雇用主向けページです。優秀な料理人とのマッチングから採用後のサポートまで、包括的なサービスを提供します。',
}

export default function EmployersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}