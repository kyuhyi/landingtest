'use client'

import { useEffect } from 'react'

export default function KakaoScript() {
  useEffect(() => {
    // 이미 로드되어 있으면 중복 로드 방지
    if ((window as any).Kakao) {
      return
    }

    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
    script.integrity = 'sha384-TiCUE00h+Q9+GfbIbKYl6iVbH+RJNGqvB5FIi4XABHv/a2TDXCT9vtFo6V+3mRVY'
    script.crossOrigin = 'anonymous'
    script.async = false // 동기식 로딩

    script.onload = () => {
      console.log('✅ Kakao SDK 스크립트 로드 완료')
    }

    script.onerror = () => {
      console.error('❌ Kakao SDK 스크립트 로드 실패')
    }

    document.head.appendChild(script)

    return () => {
      // cleanup: 컴포넌트 언마운트 시 스크립트 제거하지 않음 (전역 SDK이므로)
    }
  }, [])

  return null
}
