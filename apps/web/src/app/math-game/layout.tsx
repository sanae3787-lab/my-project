import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'さんすうゲーム',
  description: '小学1年生のためのたのしい算数ゲーム',
}

export default function MathGameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body
        style={{
          fontFamily: "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', system-ui, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </body>
    </html>
  )
}
