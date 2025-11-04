import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'
import { createUser, getUser } from '@/lib/firestore-utils'

// Firebase Admin SDK 초기화 (한 번만 실행)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export async function POST(request: NextRequest) {
  try {
    const { kakaoUserId, email, name, profileImageUrl } = await request.json()

    console.log('📥 카카오 로그인 요청:', { kakaoUserId, email, name })

    if (!kakaoUserId) {
      return NextResponse.json({ error: '카카오 사용자 ID가 없습니다.' }, { status: 400 })
    }

    // Firebase UID는 kakao_로 시작하도록 설정
    const firebaseUid = `kakao_${kakaoUserId}`

    // Firebase에 사용자 생성 또는 업데이트
    try {
      await admin.auth().getUser(firebaseUid)
      console.log('✅ 기존 Firebase 사용자 확인:', firebaseUid)
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log('💾 새 Firebase 사용자 생성:', firebaseUid)
        await admin.auth().createUser({
          uid: firebaseUid,
          email: email || `kakao_${kakaoUserId}@kakao.local`,
          displayName: name,
          photoURL: profileImageUrl,
        })

        // Firestore에 사용자 프로필 생성
        await createUser({
          uid: firebaseUid,
          email: email || `kakao_${kakaoUserId}@kakao.local`,
          name,
          role: 'user',
          profileImageUrl,
        })
        console.log('✅ Firestore 프로필 생성 완료')
      } else {
        throw error
      }
    }

    // Firebase Custom Token 발급
    const customToken = await admin.auth().createCustomToken(firebaseUid)
    console.log('✅ Custom Token 발급 완료')

    return NextResponse.json({ customToken })
  } catch (error) {
    console.error('❌ 카카오 로그인 API 오류:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
