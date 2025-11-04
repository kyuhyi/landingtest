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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error || !code) {
      console.error('❌ 카카오 인증 실패:', error)
      return NextResponse.redirect(new URL('/login?error=kakao_auth_failed', request.url))
    }

    console.log('✅ 카카오 인증 코드 수신:', code)

    // 카카오 액세스 토큰 발급
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!,
        redirect_uri: `${request.nextUrl.origin}/api/auth/kakao/callback`,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('❌ 토큰 발급 실패:', errorData)
      return NextResponse.redirect(new URL('/login?error=token_failed', request.url))
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ 액세스 토큰 발급 완료')

    // 카카오 사용자 정보 조회
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error('❌ 사용자 정보 조회 실패')
      return NextResponse.redirect(new URL('/login?error=user_info_failed', request.url))
    }

    const userData = await userResponse.json()
    console.log('📥 카카오 사용자 정보:', userData)

    const kakaoAccount = userData.kakao_account
    const profile = kakaoAccount.profile
    const email = kakaoAccount.email
    const name = profile.nickname || email?.split('@')[0] || '사용자'
    const profileImageUrl = profile.profile_image_url

    // Firebase UID는 kakao_로 시작하도록 설정
    const firebaseUid = `kakao_${userData.id}`

    // Firebase에 사용자 생성 또는 업데이트
    try {
      await admin.auth().getUser(firebaseUid)
      console.log('✅ 기존 Firebase 사용자 확인:', firebaseUid)
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log('💾 새 Firebase 사용자 생성:', firebaseUid)
        await admin.auth().createUser({
          uid: firebaseUid,
          email: email || `kakao_${userData.id}@kakao.local`,
          displayName: name,
          photoURL: profileImageUrl,
        })

        await createUser({
          uid: firebaseUid,
          email: email || `kakao_${userData.id}@kakao.local`,
          name,
          role: 'user',
          profileImageUrl,
        })
      } else {
        throw error
      }
    }

    // Firebase Custom Token 발급
    const customToken = await admin.auth().createCustomToken(firebaseUid)
    console.log('✅ Custom Token 발급 완료')

    // 클라이언트에게 Custom Token 전달 (쿼리 파라미터로)
    return NextResponse.redirect(
      new URL(`/auth/kakao/success?token=${customToken}`, request.url)
    )
  } catch (error) {
    console.error('❌ 카카오 로그인 콜백 오류:', error)
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
  }
}
