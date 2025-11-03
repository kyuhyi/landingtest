'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, Home, RefreshCw, HelpCircle } from 'lucide-react'

function PaymentFailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [failureInfo, setFailureInfo] = useState({
    code: '',
    message: '',
    orderId: '',
  })

  useEffect(() => {
    const code = searchParams.get('code') || 'UNKNOWN_ERROR'
    const message = searchParams.get('message') || '알 수 없는 오류가 발생했습니다.'
    const orderId = searchParams.get('orderId') || ''

    setFailureInfo({
      code,
      message,
      orderId,
    })
  }, [searchParams])

  const getErrorDescription = (code: string) => {
    switch (code) {
      case 'USER_CANCEL':
        return '사용자가 결제를 취소했습니다.'
      case 'INSUFFICIENT_BALANCE':
        return '잔액이 부족합니다.'
      case 'INVALID_CARD_INFO':
        return '카드 정보가 올바르지 않습니다.'
      case 'EXCEED_LIMIT':
        return '결제 한도를 초과했습니다.'
      case 'NETWORK_ERROR':
        return '네트워크 오류가 발생했습니다.'
      default:
        return '결제 처리 중 문제가 발생했습니다.'
    }
  }

  const getSolution = (code: string) => {
    switch (code) {
      case 'USER_CANCEL':
        return '처음부터 다시 시도해주세요.'
      case 'INSUFFICIENT_BALANCE':
        return '카드 잔액을 확인하시거나 다른 결제 수단을 이용해주세요.'
      case 'INVALID_CARD_INFO':
        return '카드 번호, 유효기간, CVC 번호를 다시 확인해주세요.'
      case 'EXCEED_LIMIT':
        return '카드사에 문의하거나 다른 카드로 결제해주세요.'
      case 'NETWORK_ERROR':
        return '잠시 후 다시 시도해주세요.'
      default:
        return '문제가 계속되면 고객센터로 문의해주세요.'
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-8 md:p-12">
          {/* 실패 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-center mb-4">결제에 실패했습니다</h1>
          <p className="text-center text-[var(--color-gray-400)] mb-8">
            {failureInfo.message}
          </p>

          {/* 오류 정보 */}
          <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">오류 정보</h2>
            <div className="space-y-3">
              {failureInfo.orderId && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-gray-400)]">주문번호</span>
                  <span className="font-mono text-sm">{failureInfo.orderId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--color-gray-400)]">오류 코드</span>
                <span className="font-mono text-sm text-red-500">{failureInfo.code}</span>
              </div>
              <div className="pt-3 border-t border-[var(--color-gray-800)]">
                <p className="text-[var(--color-gray-300)] text-sm">
                  {getErrorDescription(failureInfo.code)}
                </p>
              </div>
            </div>
          </div>

          {/* 해결 방법 */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              해결 방법
            </h3>
            <p className="text-sm text-[var(--color-gray-300)]">
              {getSolution(failureInfo.code)}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-gray-400)]">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>결제 정보를 다시 확인해주세요.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>다른 결제 수단을 이용해보세요.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>문제가 계속되면 카드사 또는 고객센터에 문의해주세요.</span>
              </li>
            </ul>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-[var(--color-blue-600)] text-white rounded-lg font-medium text-center hover:bg-[var(--color-blue-700)] transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              다시 시도
            </button>
            <Link
              href="/products"
              className="flex-1 px-6 py-3 bg-[var(--color-gray-700)] text-white rounded-lg font-medium text-center hover:bg-[var(--color-gray-600)] transition-colors"
            >
              상품 목록
            </Link>
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-transparent border-2 border-[var(--color-gray-700)] text-white rounded-lg font-medium text-center hover:bg-[var(--color-gray-700)] hover:bg-opacity-20 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              홈으로
            </Link>
          </div>
        </div>

        {/* 고객 지원 */}
        <div className="mt-8 text-center text-sm text-[var(--color-gray-500)]">
          <p>결제 관련 문의사항이 있으신가요?</p>
          <Link href="/#contact" className="text-[var(--color-blue-600)] hover:underline">
            고객센터 바로가기
          </Link>
          <p className="mt-2">또는 1588-1234로 전화주세요.</p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailContent />
    </Suspense>
  )
}
