import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'BSD 바이브코딩 온라인 VOD - 코딩 몰라도 24시간만에 웹사이트 만들기',
  description: '비전공자를 위한 AI 바이브코딩 온라인 강의. 코딩 지식 없이도 24시간 안에 실전 웹사이트를 만드세요.',
  keywords: ['바이브코딩', 'AI코딩', '비전공자', '웹사이트 제작', 'BSD', '온라인 강의'],
  authors: [{ name: 'BSD 바이브코딩' }],
  openGraph: {
    title: 'BSD 바이브코딩 온라인 VOD',
    description: '비전공자를 위한 AI 바이브코딩 온라인 강의',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
