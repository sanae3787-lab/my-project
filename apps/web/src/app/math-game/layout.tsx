import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'さんすうゲーム',
  description: '小学1年生のためのたのしい算数ゲーム',
}

export default function MathGameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
