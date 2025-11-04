import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'

const SECRET_KEY = process.env.TOSS_SECRET_KEY

// Firebase Admin SDK 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const adminDb = admin.firestore()

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount, userId, userEmail, userName, productId, productName } = await request.json()

    console.log('💳 결제 승인 요청:', { paymentKey, orderId, amount, userId, productId })

    if (!SECRET_KEY) {
      return NextResponse.json(
        { error: 'TOSS_SECRET_KEY가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // ────────────────────────────────────────────────────────
    // STEP 1: 토스페이먼츠 결제 승인
    // ────────────────────────────────────────────────────────
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${SECRET_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: parseInt(amount),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ 토스 결제 승인 실패:', data)
      return NextResponse.json(
        { error: data.message || '결제 승인 실패' },
        { status: response.status }
      )
    }

    console.log('✅ 토스 결제 승인 완료')

    // ────────────────────────────────────────────────────────
    // STEP 2: Firestore에 주문 데이터 저장 (Admin SDK 사용!)
    // ────────────────────────────────────────────────────────
    console.log('💾 Firestore에 주문 저장 시작...')

    const orderRef = adminDb.collection('orders').doc(orderId)
    const now = admin.firestore.Timestamp.now()

    await orderRef.set({
      id: orderId,
      userId: userId || '',
      userEmail: userEmail || '',
      userName: userName || '',
      productId: productId || '',
      productName: productName || '강의',
      amount: parseInt(amount),
      status: 'completed',
      paymentKey,
      orderId,
      createdAt: now,
      updatedAt: now,
    })

    console.log('✅ Firestore 주문 저장 완료:', orderId)

    return NextResponse.json({
      ...data,
      orderSaved: true,
    })
  } catch (error) {
    console.error('❌ 결제 승인 중 오류:', error)
    return NextResponse.json(
      { error: '결제 승인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
