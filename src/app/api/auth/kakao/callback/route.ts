/**
 * ============================================================
 * 카카오 로그인 Callback API
 * ============================================================
 *
 * 📝 목적:
 * - 카카오 OAuth 인증 후 호출되는 서버 사이드 API
 * - Authorization Code → Access Token → 사용자 정보 → Firebase 연동
 *
 * 🔄 전체 흐름:
 * 1. 카카오에서 Authorization Code 받기
 * 2. Code를 Access Token으로 교환
 * 3. Access Token으로 사용자 정보 조회
 * 4. Firebase Authentication에 사용자 생성/확인
 * 5. Firestore에 사용자 데이터 저장
 * 6. Custom Token 발급
 * 7. Success 페이지로 리다이렉트
 *
 * ⚠️ 주의사항:
 * - 이 API는 반드시 서버에서만 실행됨 (브라우저 직접 호출 불가)
 * - Firebase Admin SDK 사용 (클라이언트 SDK 아님!)
 * - Private Key는 절대 노출되지 않음 (서버 환경 변수)
 */

import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'

// ============================================================
// Firebase Admin SDK 초기화
// ============================================================
//
// 💡 Admin SDK란?
// - 서버 환경에서 Firebase를 제어하는 관리자 권한 SDK
// - 클라이언트 SDK와 달리 모든 권한을 가짐
// - Firestore 보안 규칙을 우회하여 데이터 접근 가능
//
// 🔒 보안:
// - Private Key는 서버 환경 변수에 저장
// - 브라우저에 절대 노출되지 않음
//
// 📌 초기화는 한 번만 실행 (중복 방지)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Private Key의 이스케이프된 줄바꿈(\n)을 실제 줄바꿈으로 변환
      // 환경 변수에서는 "\\n"으로 저장되지만 실제 사용 시 "\n"으로 변환 필요
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

// Firestore Admin 인스턴스 생성
// 💡 admin.firestore()는 서버에서 Firestore를 직접 제어
// 💡 클라이언트 SDK의 getFirestore()와 다름!
const adminDb = admin.firestore()

// ============================================================
// GET /api/auth/kakao/callback
// ============================================================
//
// 📥 입력 (URL 파라미터):
// - code: 카카오에서 발급한 Authorization Code
// - error: 인증 실패 시 에러 코드
//
// 📤 출력 (리다이렉트):
// - 성공: /auth/kakao/success?token={customToken}
// - 실패: /login?error={errorType}
export async function GET(request: NextRequest) {
  try {
    // ────────────────────────────────────────────────────────
    // STEP 1: Authorization Code 받기
    // ────────────────────────────────────────────────────────
    //
    // 카카오 로그인 성공 후 이 API로 리다이렉트될 때
    // URL에 `code` 파라미터가 포함됨
    // 예: /api/auth/kakao/callback?code=abc123xyz
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')          // Authorization Code
    const error = searchParams.get('error')        // 에러 발생 시

    // 에러 체크: code가 없거나 error가 있으면 실패
    if (error || !code) {
      console.error('❌ 카카오 인증 실패:', error)
      return NextResponse.redirect(
        new URL('/login?error=kakao_auth_failed', request.url)
      )
    }

    console.log('✅ 카카오 인증 코드 수신:', code)

    // ────────────────────────────────────────────────────────
    // STEP 2: Access Token 발급
    // ────────────────────────────────────────────────────────
    //
    // 📌 왜 Access Token이 필요한가?
    // - Authorization Code는 일회용이며 사용자 정보를 가져올 수 없음
    // - Access Token은 카카오 API를 호출하는 데 사용되는 실제 인증 토큰
    //
    // 🔄 OAuth 2.0 표준 흐름:
    // 1. Authorization Code 받기 (이미 완료)
    // 2. Code를 Access Token으로 교환 (지금 진행)
    // 3. Access Token으로 리소스 접근 (다음 단계)
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',              // 인증 타입 (고정값)
        client_id: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!,  // 카카오 앱 JavaScript 키
        redirect_uri: `${request.nextUrl.origin}/api/auth/kakao/callback`,  // 이 API 주소
        code,  // STEP 1에서 받은 Authorization Code
      }),
    })

    // 토큰 발급 실패 처리
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('❌ 토큰 발급 실패:', errorData)
      return NextResponse.redirect(
        new URL('/login?error=token_failed', request.url)
      )
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ 액세스 토큰 발급 완료')

    // 📦 tokenData 응답 구조:
    // {
    //   access_token: "xxxxxx",        // 카카오 API 호출용 토큰
    //   token_type: "bearer",          // 토큰 타입 (항상 bearer)
    //   refresh_token: "yyyyyy",       // 토큰 갱신용 (선택사항)
    //   expires_in: 21599,             // 만료 시간 (초)
    //   scope: "profile_nickname ..."  // 허용된 권한 범위
    // }

    // ────────────────────────────────────────────────────────
    // STEP 3: 카카오 사용자 정보 조회
    // ────────────────────────────────────────────────────────
    //
    // 🔑 Access Token을 사용하여 카카오 사용자 정보 API 호출
    // 📌 이 API는 인증된 사용자만 호출 가능 (Authorization 헤더 필수)
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        // Bearer 토큰 방식으로 Access Token 전달
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error('❌ 사용자 정보 조회 실패')
      return NextResponse.redirect(
        new URL('/login?error=user_info_failed', request.url)
      )
    }

    const userData = await userResponse.json()
    console.log('📥 카카오 사용자 정보:', userData)

    // 📦 userData 응답 구조:
    // {
    //   id: 3740123456,  // 카카오 사용자 고유 ID (숫자)
    //   connected_at: "2024-01-01T00:00:00Z",
    //   kakao_account: {
    //     profile_nickname_needs_agreement: false,
    //     profile_image_needs_agreement: false,
    //     profile: {
    //       nickname: "홍길동",
    //       profile_image_url: "http://...",
    //       thumbnail_image_url: "http://..."
    //     },
    //     has_email: true,
    //     email_needs_agreement: false,
    //     is_email_valid: true,
    //     is_email_verified: true,
    //     email: "hong@kakao.com"
    //   }
    // }

    // 필요한 정보 추출
    const kakaoAccount = userData.kakao_account
    const profile = kakaoAccount.profile
    const email = kakaoAccount.email
    // 닉네임이 없으면 이메일 앞부분, 그것도 없으면 "사용자"
    const name = profile.nickname || email?.split('@')[0] || '사용자'
    const profileImageUrl = profile.profile_image_url

    // ────────────────────────────────────────────────────────
    // STEP 4: Firebase UID 생성
    // ────────────────────────────────────────────────────────
    //
    // 💡 왜 `kakao_` 접두사를 붙이는가?
    // - Firebase에서 여러 소셜 로그인을 사용할 때 UID 충돌 방지
    // - 예: 카카오 ID 3740123456 → Firebase UID "kakao_3740123456"
    // - 향후 Google, Naver 로그인 추가 시 "google_123", "naver_456" 형태로 구분
    const firebaseUid = `kakao_${userData.id}`

    // ────────────────────────────────────────────────────────
    // STEP 5: Firebase Authentication 처리
    // ────────────────────────────────────────────────────────
    //
    // 📌 Firebase Authentication이란?
    // - 사용자 인증/로그인 상태를 관리하는 Firebase 서비스
    // - 이메일/비밀번호, 소셜 로그인, Custom Token 등 지원
    //
    // 🔄 로직:
    // 1. 기존 사용자인지 확인 (getUser)
    // 2. 없으면 새로 생성 (createUser)
    // 3. 있으면 그대로 사용
    let isNewUser = false  // 신규 사용자 여부 플래그

    try {
      // Firebase에서 해당 UID의 사용자 조회
      await admin.auth().getUser(firebaseUid)
      console.log('✅ 기존 Firebase Auth 사용자 확인:', firebaseUid)
    } catch (error: any) {
      // auth/user-not-found: 사용자가 없음 → 새로 생성
      if (error.code === 'auth/user-not-found') {
        console.log('💾 새 Firebase Auth 사용자 생성:', firebaseUid)
        isNewUser = true

        // Firebase Authentication에 새 사용자 생성
        await admin.auth().createUser({
          uid: firebaseUid,  // 커스텀 UID 지정
          // 이메일이 없는 경우 임시 이메일 생성 (Firebase는 email 필드 필수)
          email: email || `kakao_${userData.id}@kakao.local`,
          displayName: name,  // 표시 이름
          photoURL: profileImageUrl,  // 프로필 사진 URL
        })
      } else {
        // 다른 에러는 상위로 전달 (예: 네트워크 오류)
        throw error
      }
    }

    // ────────────────────────────────────────────────────────
    // STEP 6: Firestore 데이터 저장
    // ────────────────────────────────────────────────────────
    //
    // 📌 Firebase Authentication vs Firestore의 차이
    // - Authentication: 로그인/인증 상태만 관리 (제한된 정보)
    // - Firestore: 실제 사용자 데이터 저장 (상세 정보, 관계 데이터 등)
    //
    // ⚠️ 중요: 서버에서는 반드시 Admin SDK 사용!
    // - 클라이언트 SDK (firebase/firestore)는 서버에서 작동 안 함
    // - Admin SDK (admin.firestore())만 서버에서 사용 가능
    //
    // 🏗️ Firestore 구조:
    // users (컬렉션)
    //   └─ kakao_3740123456 (문서)
    //       ├─ uid: "kakao_3740123456"
    //       ├─ email: "hong@kakao.com"
    //       ├─ name: "홍길동"
    //       ├─ role: "user"
    //       ├─ profileImageUrl: "http://..."
    //       ├─ createdAt: Timestamp
    //       └─ updatedAt: Timestamp
    const userRef = adminDb.collection('users').doc(firebaseUid)
    const userDoc = await userRef.get()

    if (!userDoc.exists || isNewUser) {
      // 신규 사용자: 새 문서 생성
      console.log('💾 Firestore에 사용자 정보 저장:', firebaseUid)
      const now = admin.firestore.Timestamp.now()

      // set(): 문서 전체를 새로 생성 또는 덮어쓰기
      await userRef.set({
        uid: firebaseUid,
        email: email || `kakao_${userData.id}@kakao.local`,
        name,
        role: 'user',  // 기본 역할 (향후 'admin', 'premium' 등 추가 가능)
        profileImageUrl: profileImageUrl || null,
        createdAt: now,  // 생성 시간
        updatedAt: now,  // 수정 시간
      })

      console.log('✅ Firestore 사용자 정보 저장 완료')
    } else {
      // 기존 사용자: 프로필 정보만 업데이트
      console.log('✅ 기존 Firestore 사용자 확인')

      // update(): 특정 필드만 업데이트 (나머지는 유지)
      await userRef.update({
        name,  // 카카오에서 닉네임을 변경했을 수 있으므로 업데이트
        profileImageUrl: profileImageUrl || null,  // 프로필 사진도 업데이트
        updatedAt: admin.firestore.Timestamp.now(),  // 수정 시간 갱신
      })

      console.log('✅ Firestore 사용자 정보 업데이트 완료')
    }

    // ────────────────────────────────────────────────────────
    // STEP 7: Custom Token 발급
    // ────────────────────────────────────────────────────────
    //
    // 📌 Custom Token이란?
    // - 서버에서 발급하는 일회용 Firebase 로그인 토큰
    // - 클라이언트는 이 토큰으로 Firebase에 로그인 가능
    //
    // 🔄 왜 Custom Token을 사용하는가?
    // 1. 보안: 카카오 Access Token이 클라이언트에 노출되지 않음
    // 2. 간편함: 클라이언트는 토큰만 받아서 로그인하면 됨
    // 3. 제어: 서버에서 사용자 검증 후 토큰 발급 (악의적 접근 차단)
    //
    // 📝 흐름:
    // 서버 (여기) → Custom Token 발급
    //   → 클라이언트로 전달
    //     → 클라이언트에서 signInWithCustomToken(token)
    //       → Firebase 로그인 완료!
    const customToken = await admin.auth().createCustomToken(firebaseUid)
    console.log('✅ Custom Token 발급 완료')

    // ────────────────────────────────────────────────────────
    // STEP 8: Success 페이지로 리다이렉트
    // ────────────────────────────────────────────────────────
    //
    // 🔄 흐름:
    // 1. 현재 (서버): Custom Token 발급 완료
    // 2. Success 페이지로 리다이렉트 (토큰을 URL 파라미터로 전달)
    // 3. Success 페이지 (클라이언트): 토큰으로 Firebase 로그인
    // 4. 메인 페이지로 이동
    //
    // ⚠️ 보안 참고:
    // - URL 파라미터로 토큰 전달은 HTTPS에서는 안전함
    // - Custom Token은 일회용이며 짧은 시간 내에 사용되어야 함
    // - 더 높은 보안이 필요하면 세션 쿠키 사용 가능
    return NextResponse.redirect(
      new URL(`/auth/kakao/success?token=${customToken}`, request.url)
    )

  } catch (error) {
    // ────────────────────────────────────────────────────────
    // 전역 에러 핸들링
    // ────────────────────────────────────────────────────────
    //
    // 🐛 디버깅 팁:
    // - 콘솔 로그 확인
    // - Firebase Console에서 Authentication, Firestore 확인
    // - 네트워크 탭에서 API 응답 확인
    console.error('❌ 카카오 로그인 콜백 오류:', error)
    return NextResponse.redirect(
      new URL('/login?error=callback_failed', request.url)
    )
  }
}

/**
 * ============================================================
 * 학습 체크리스트
 * ============================================================
 *
 * ✅ 이해해야 할 핵심 개념:
 *
 * 1. OAuth 2.0 Authorization Code Flow
 *    - Authorization Code를 Access Token으로 교환
 *    - Access Token으로 사용자 정보 조회
 *
 * 2. Firebase Admin SDK vs Client SDK
 *    - Admin SDK: 서버 전용, 모든 권한, 보안 키 필요
 *    - Client SDK: 브라우저 전용, 제한된 권한, 보안 규칙 적용
 *
 * 3. Custom Token 방식
 *    - 서버에서 인증 완료 후 토큰 발급
 *    - 클라이언트는 토큰만 받아서 로그인
 *    - 카카오 Access Token이 클라이언트에 노출되지 않음
 *
 * 4. Firestore 데이터 모델링
 *    - Collection: 문서들의 집합
 *    - Document: 실제 데이터 (JSON 형태)
 *    - Timestamp: 서버 시간 기록 (클라이언트 시간과 무관)
 *
 * 5. 에러 처리
 *    - try-catch로 전체 감싸기
 *    - 각 단계별 에러 체크
 *    - 사용자에게 적절한 에러 메시지 전달
 *
 * ============================================================
 * 다음 단계 학습 주제:
 * ============================================================
 *
 * 1. 로그아웃 구현
 * 2. 프로필 수정 기능
 * 3. 역할 기반 권한 관리 (RBAC)
 * 4. Refresh Token 관리
 * 5. 다른 소셜 로그인 추가 (Google, Naver 등)
 */
