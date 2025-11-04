'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithCustomToken } from 'firebase/auth'
import { auth } from '@/lib/firebase'

function KakaoSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleKakaoLogin = async () => {
      const token = searchParams.get('token')

      if (!token) {
        console.error('❌ Custom Token이 없습니다.')
        router.push('/login?error=no_token')
        return
      }

      try {
        console.log('🔥 Firebase Custom Token으로 로그인 시작')
        const userCredential = await signInWithCustomToken(auth, token)
        console.log('✅ Firebase 로그인 성공:', userCredential.user.uid)

        // 로그인 성공 후 메인 페이지로 리다이렉트
        router.push('/')
      } catch (error) {
        console.error('❌ Firebase 로그인 실패:', error)
        router.push('/login?error=firebase_signin_failed')
      }
    }

    handleKakaoLogin()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bsd-dark">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-bsd-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">카카오 로그인 처리 중...</p>
      </div>
    </div>
  )
}

export default function KakaoSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bsd-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-bsd-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">로딩 중...</p>
        </div>
      </div>
    }>
      <KakaoSuccessContent />
    </Suspense>
  )
}
