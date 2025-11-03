'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Home, BookOpen } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createOrder } from '@/lib/firestore-utils'
import { getProductById } from '@/data/products'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userProfile, loading } = useAuth()
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: '',
    amount: 0,
    orderName: '',
    paymentKey: '',
    productId: '',
  })
  const [paymentProcessed, setPaymentProcessed] = useState(false)

  useEffect(() => {
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount')
    const paymentKey = searchParams.get('paymentKey')
    const orderName = searchParams.get('orderName') || '강의'
    const productId = searchParams.get('productId') || ''

    if (!orderId || !amount || !paymentKey) {
      alert('잘못된 접근입니다.')
      router.push('/')
      return
    }

    setPaymentInfo({
      orderId,
      amount: parseInt(amount),
      orderName,
      paymentKey,
      productId,
    })
  }, [searchParams, router])

  // userProfile이 로드된 후 결제 승인 및 Firestore 저장
  useEffect(() => {
    if (loading) {
      console.log('⏳ userProfile 로딩 중...')
      return
    }

    if (!userProfile) {
      console.error('❌ userProfile이 로드되지 않았습니다. 로그인 페이지로 리다이렉트')
      alert('로그인이 필요합니다. 다시 로그인해주세요.')
      router.push('/login')
      return
    }

    if (!paymentInfo.orderId || paymentProcessed) {
      return
    }

    console.log('✅ userProfile 로드 완료, 결제 승인 시작')
    setPaymentProcessed(true)
    confirmPayment(
      paymentInfo.paymentKey,
      paymentInfo.orderId,
      paymentInfo.amount.toString(),
      paymentInfo.productId,
      paymentInfo.orderName
    )
  }, [userProfile, loading, paymentInfo, paymentProcessed, router])

  const confirmPayment = async (
    paymentKey: string,
    orderId: string,
    amount: string,
    productId: string,
    orderName: string
  ) => {
    try {
      console.log('💳 결제 승인 시작:', { paymentKey, orderId, amount, productId, orderName })

      // 1. 서버 사이드 API를 통해 안전하게 결제 승인 처리
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ 결제 승인 API 실패:', errorData)
        throw new Error(errorData.error || '결제 승인 실패')
      }

      const result = await response.json()
      console.log('✅ 결제 승인 완료:', result)

      // 2. Firestore에 주문 데이터 저장
      if (!userProfile) {
        console.error('❌ userProfile이 없습니다. 로그인 상태를 확인하세요.')
        alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.')
        return
      }

      console.log('💾 Firestore에 주문 데이터 저장 시작...')
      console.log('📦 저장할 주문 데이터:', {
        id: orderId,
        userId: userProfile.id,
        userEmail: userProfile.email,
        userName: userProfile.name,
        productId,
        productName: orderName,
        amount: parseInt(amount),
        status: 'completed',
        paymentKey,
        orderId,
      })

      await createOrder({
        id: orderId,
        userId: userProfile.id,
        userEmail: userProfile.email,
        userName: userProfile.name,
        productId,
        productName: orderName,
        amount: parseInt(amount),
        status: 'completed',
        paymentKey,
        orderId,
      })

      console.log('✅ 주문 데이터 Firestore 저장 완료!')
      console.log('🔍 Firebase Console에서 확인: orders 컬렉션 → 문서 ID:', orderId)
    } catch (error) {
      console.error('❌ 결제 처리 오류:', error)
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message)
        console.error('에러 스택:', error.stack)
      }
      alert('결제 승인 처리 중 오류가 발생했습니다. 고객센터로 문의해주세요.')
    }
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ko-KR')
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="bg-[var(--color-gray-900)] border border-[var(--color-gray-800)] rounded-lg p-8 md:p-12">
          {/* 성공 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-center mb-4">결제가 완료되었습니다!</h1>
          <p className="text-center text-[var(--color-gray-400)] mb-8">
            강의 수강이 시작됩니다. 이메일로 수강 안내가 발송되었습니다.
          </p>

          {/* 결제 정보 */}
          <div className="bg-[var(--color-dark)] border border-[var(--color-gray-800)] rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">결제 정보</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--color-gray-400)]">주문번호</span>
                <span className="font-mono text-sm">{paymentInfo.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-gray-400)]">상품명</span>
                <span className="font-medium">{paymentInfo.orderName}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[var(--color-gray-800)]">
                <span className="text-[var(--color-gray-400)]">결제금액</span>
                <span className="text-xl font-bold text-[var(--color-blue-600)]">
                  {formatAmount(paymentInfo.amount)}원
                </span>
              </div>
            </div>
          </div>

          {/* 다음 단계 안내 */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              다음 단계
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-gray-300)]">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">1.</span>
                <span>등록하신 이메일로 수강 안내 메일이 발송되었습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">2.</span>
                <span>마이페이지에서 수강 중인 강의를 확인할 수 있습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">3.</span>
                <span>강의 자료는 학습 플랫폼에서 다운로드 가능합니다.</span>
              </li>
            </ul>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/mypage"
              className="flex-1 px-6 py-3 bg-[var(--color-blue-600)] text-white rounded-lg font-medium text-center hover:bg-[var(--color-blue-700)] transition-colors"
            >
              마이페이지로 이동
            </Link>
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-[var(--color-gray-700)] text-white rounded-lg font-medium text-center hover:bg-[var(--color-gray-600)] transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              홈으로
            </Link>
          </div>

          {/* 영수증 다운로드 */}
          <div className="mt-6 text-center">
            <button className="text-sm text-[var(--color-blue-600)] hover:underline flex items-center gap-2 mx-auto">
              <Download className="w-4 h-4" />
              영수증 다운로드
            </button>
          </div>
        </div>

        {/* 고객 지원 */}
        <div className="mt-8 text-center text-sm text-[var(--color-gray-500)]">
          <p>문의사항이 있으신가요?</p>
          <Link href="/#contact" className="text-[var(--color-blue-600)] hover:underline">
            고객센터 바로가기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
