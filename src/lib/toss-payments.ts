'use client'

import { loadTossPayments } from '@tosspayments/tosspayments-sdk'

// 토스페이먼츠 API 개별 연동 키
const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
const SECRET_KEY = process.env.TOSS_SECRET_KEY

if (!CLIENT_KEY) {
  throw new Error('NEXT_PUBLIC_TOSS_CLIENT_KEY 환경변수가 설정되지 않았습니다.')
}

if (!SECRET_KEY) {
  throw new Error('TOSS_SECRET_KEY 환경변수가 설정되지 않았습니다.')
}

export interface PaymentInfo {
  orderId: string
  orderName: string
  amount: number
  customerEmail?: string
  customerName?: string
  productId?: string
}

export async function requestPayment(paymentInfo: PaymentInfo) {
  try {
    const tossPayments = await loadTossPayments(CLIENT_KEY)

    // 카드 결제 위젯 가져오기
    const payment = tossPayments.payment({
      customerKey: paymentInfo.customerEmail || 'GUEST',
    })

    // 결제 요청
    const successUrl = `${window.location.origin}/payment/success?productId=${paymentInfo.productId || ''}`
    const failUrl = `${window.location.origin}/payment/fail`

    await payment.requestPayment({
      method: 'CARD',
      amount: {
        currency: 'KRW',
        value: paymentInfo.amount,
      },
      orderId: paymentInfo.orderId,
      orderName: paymentInfo.orderName,
      successUrl,
      failUrl,
      customerEmail: paymentInfo.customerEmail,
      customerName: paymentInfo.customerName,
    })
  } catch (error) {
    console.error('결제 요청 중 오류 발생:', error)
    throw error
  }
}

export function generateOrderId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `ORDER-${timestamp}-${random}`
}
