'use client'

import { useEffect } from 'react'

export default function KakaoScript() {
  useEffect(() => {
    // 이미 로드되어 있으면 중복 로드 방지
    if ((window as any).Kakao) {
      console.log('✅ Kakao SDK 이미 로드됨')
      return
    }

    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
    script.async = false // 동기식 로딩
    script.defer = false

    script.onload = () => {
      console.log('✅ Kakao SDK 스크립트 로드 완료')
      if ((window as any).Kakao) {
        console.log('✅ window.Kakao 객체 확인됨')
      } else {
        console.error('❌ 스크립트는 로드되었으나 window.Kakao 객체가 없음')
      }
    }

    script.onerror = (error) => {
      console.error('❌ Kakao SDK 스크립트 로드 실패:', error)
    }

    document.head.appendChild(script)

    return () => {
      // cleanup: 컴포넌트 언마운트 시 스크립트 제거하지 않음 (전역 SDK이므로)
    }
  }, [])

  return null
}
