# 카카오 로그인 구현 가이드 (REST API + Firebase)

## 📚 목차
1. [전체 흐름도](#전체-흐름도)
2. [사전 준비](#사전-준비)
3. [단계별 구현](#단계별-구현)
4. [환경 변수 설정](#환경-변수-설정)
5. [테스트 방법](#테스트-방법)
6. [트러블슈팅](#트러블슈팅)

---

## 전체 흐름도

```
┌─────────────┐
│   사용자    │
└──────┬──────┘
       │ 1. 카카오 로그인 버튼 클릭
       ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend: 로그인 페이지 (/login)                        │
│  - 카카오 OAuth 인증 URL로 리다이렉트                     │
│  - redirect_uri: /api/auth/kakao/callback                │
└──────┬──────────────────────────────────────────────────┘
       │ 2. 카카오 로그인 페이지로 이동
       ▼
┌─────────────────────────────────────────────────────────┐
│  Kakao OAuth Server                                      │
│  - 사용자 인증 (카카오 계정)                              │
│  - 동의 화면 (이메일, 프로필 등)                          │
└──────┬──────────────────────────────────────────────────┘
       │ 3. 인증 성공 → Authorization Code 발급
       ▼
┌─────────────────────────────────────────────────────────┐
│  Backend: Callback API (/api/auth/kakao/callback)       │
│                                                           │
│  STEP 1: Authorization Code 받기                         │
│  ├─ URL에서 code 파라미터 추출                           │
│  └─ 에러 체크                                            │
│                                                           │
│  STEP 2: Access Token 발급 (카카오)                      │
│  ├─ POST https://kauth.kakao.com/oauth/token            │
│  ├─ grant_type: authorization_code                       │
│  ├─ client_id: KAKAO_JS_KEY                             │
│  ├─ code: authorization_code                            │
│  └─ Response: access_token                               │
│                                                           │
│  STEP 3: 사용자 정보 조회 (카카오)                        │
│  ├─ GET https://kapi.kakao.com/v2/user/me               │
│  ├─ Authorization: Bearer {access_token}                │
│  └─ Response: 사용자 ID, 이메일, 프로필 등                │
│                                                           │
│  STEP 4: Firebase Authentication 처리                    │
│  ├─ Firebase UID: kakao_{카카오ID}                       │
│  ├─ 기존 사용자 확인                                     │
│  └─ 신규 사용자면 createUser()                           │
│                                                           │
│  STEP 5: Firestore 데이터 저장 (Admin SDK)               │
│  ├─ Collection: users                                    │
│  ├─ Document ID: kakao_{카카오ID}                        │
│  ├─ 데이터: uid, email, name, role, profileImageUrl      │
│  └─ Timestamp: createdAt, updatedAt                      │
│                                                           │
│  STEP 6: Custom Token 발급 (Firebase Admin)              │
│  ├─ createCustomToken(firebaseUid)                      │
│  └─ 클라이언트 전용 토큰 생성                             │
│                                                           │
│  STEP 7: Success 페이지로 리다이렉트                      │
│  └─ /auth/kakao/success?token={customToken}             │
└──────┬──────────────────────────────────────────────────┘
       │ 4. Custom Token과 함께 리다이렉트
       ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend: Success 페이지 (/auth/kakao/success)          │
│                                                           │
│  STEP 1: URL에서 Custom Token 추출                        │
│  STEP 2: Firebase Client SDK로 로그인                     │
│  ├─ signInWithCustomToken(auth, token)                  │
│  └─ Firebase Auth State 업데이트                          │
│                                                           │
│  STEP 3: 메인 페이지로 리다이렉트                          │
│  └─ router.push('/')                                     │
└──────┬──────────────────────────────────────────────────┘
       │ 5. 로그인 완료
       ▼
┌─────────────┐
│  메인 페이지 │
│  (로그인됨)  │
└─────────────┘
```

---

## 사전 준비

### 1. 카카오 개발자 계정 및 앱 생성

#### 1-1. 카카오 개발자 사이트 접속
- URL: https://developers.kakao.com
- 카카오 계정으로 로그인

#### 1-2. 애플리케이션 추가
1. **내 애플리케이션** 메뉴 클릭
2. **애플리케이션 추가하기** 버튼 클릭
3. 앱 이름, 사업자명 입력
4. **저장** 클릭

#### 1-3. 앱 키 확인
- **앱 설정** > **요약 정보**
- **JavaScript 키** 복사 (예: `38f9bf8d248ef38208dc3538cfb845ce`)

#### 1-4. 플랫폼 설정
1. **앱 설정** > **플랫폼**
2. **Web 플랫폼 등록** 클릭
3. 사이트 도메인 등록:
   ```
   개발: http://localhost:3000
   운영: https://yourdomain.com
   ```

#### 1-5. Redirect URI 설정
1. **제품 설정** > **카카오 로그인**
2. **Redirect URI** 등록:
   ```
   개발: http://localhost:3000/api/auth/kakao/callback
   운영: https://yourdomain.com/api/auth/kakao/callback
   ```

#### 1-6. 동의 항목 설정
1. **제품 설정** > **카카오 로그인** > **동의 항목**
2. 필요한 항목 활성화:
   - **프로필 정보 (닉네임/프로필 사진)**: 선택 동의
   - **카카오 계정 (이메일)**: 선택 동의

---

### 2. Firebase 프로젝트 설정

#### 2-1. Firebase Console 접속
- URL: https://console.firebase.google.com
- Google 계정으로 로그인

#### 2-2. 프로젝트 생성
1. **프로젝트 추가** 클릭
2. 프로젝트 이름 입력 (예: `bsd-test`)
3. Google Analytics 설정 (선택사항)
4. **프로젝트 만들기** 클릭

#### 2-3. 웹 앱 등록
1. 프로젝트 개요 > **웹 앱 추가** (</> 아이콘)
2. 앱 닉네임 입력
3. **Firebase SDK 구성 정보** 복사 (나중에 사용)

#### 2-4. Authentication 활성화
1. **Authentication** 메뉴 클릭
2. **Sign-in method** 탭
3. **이메일/비밀번호** 활성화 (Custom Auth에 필요)

#### 2-5. Firestore 데이터베이스 생성
1. **Firestore Database** 메뉴 클릭
2. **데이터베이스 만들기** 클릭
3. **프로덕션 모드**로 시작
4. 위치 선택: `asia-northeast3` (서울)

#### 2-6. Firestore 보안 규칙 설정
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 문서만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 관리자는 모든 사용자 정보 읽기 가능
    match /users/{userId} {
      allow read: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### 2-7. Firebase Admin SDK 서비스 계정 생성
1. **프로젝트 설정** (⚙️ 아이콘) > **서비스 계정**
2. **새 비공개 키 생성** 클릭
3. JSON 파일 다운로드
4. JSON 파일 내용 확인:
   ```json
   {
     "type": "service_account",
     "project_id": "bsd-test-6de41",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-fbsvc@bsd-test-6de41.iam.gserviceaccount.com",
     ...
   }
   ```

---

## 단계별 구현

### STEP 1: 환경 변수 설정

#### `.env.development` 파일 생성
```bash
# Firebase Client SDK (공개 가능)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDkYblmjbU2f91VHYwsMN0U4W-dE4bq74w
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bsd-test-6de41.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bsd-test-6de41
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bsd-test-6de41.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1085589976877
NEXT_PUBLIC_FIREBASE_APP_ID=1:1085589976877:web:d46998748b64da2c1645a4
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-G4B5QNH63P

# Kakao Login (JavaScript SDK)
NEXT_PUBLIC_KAKAO_JS_KEY=38f9bf8d248ef38208dc3538cfb845ce

# Firebase Admin SDK (서버 전용 - 절대 공개 금지!)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@bsd-test-6de41.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQI...(전체 키)...FZs=\n-----END PRIVATE KEY-----\n"
```

**중요 사항:**
- `NEXT_PUBLIC_` 접두사: 클라이언트에서 접근 가능 (브라우저에 노출됨)
- 접두사 없음: 서버에서만 접근 가능 (보안 유지)
- `FIREBASE_PRIVATE_KEY`는 반드시 큰따옴표로 감싸기
- `\n`은 실제 줄바꿈이 아닌 문자열 `\n`

---

### STEP 2: Firebase 초기화 (클라이언트)

#### `src/lib/firebase.ts`
```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정 (환경 변수에서 가져오기)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase 앱 초기화 (중복 초기화 방지)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase 서비스 인스턴스
const auth = getAuth(app);      // Authentication
const db = getFirestore(app);   // Firestore Database

export { app, auth, db };
```

**학습 포인트:**
- `getApps().length === 0`: 이미 초기화된 앱이 있는지 확인
- Hot Module Replacement (HMR) 환경에서 중복 초기화 방지
- Client SDK는 브라우저에서 실행됨

---

### STEP 3: 로그인 버튼 구현

#### `src/app/login/page.tsx` (간소화 버전)
```typescript
'use client'

export default function LoginPage() {
  const handleKakaoLogin = () => {
    // 카카오 OAuth 인증 URL 생성
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&redirect_uri=${window.location.origin}/api/auth/kakao/callback&response_type=code`

    // 카카오 로그인 페이지로 리다이렉트
    window.location.href = KAKAO_AUTH_URL
  }

  return (
    <div>
      <h1>로그인</h1>
      <button onClick={handleKakaoLogin}>
        카카오 로그인
      </button>
    </div>
  )
}
```

**URL 파라미터 설명:**
- `client_id`: 카카오 JavaScript 키
- `redirect_uri`: 인증 후 돌아올 주소 (백엔드 Callback API)
- `response_type=code`: Authorization Code 방식 사용

---

### STEP 4: Callback API 구현 (핵심!)

#### `src/app/api/auth/kakao/callback/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'

// ============================================================
// Firebase Admin SDK 초기화 (서버 전용)
// ============================================================
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Private Key의 \n을 실제 줄바꿈으로 변환
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

// Firestore Admin 인스턴스 (서버에서 Firestore 직접 접근)
const adminDb = admin.firestore()

// ============================================================
// GET /api/auth/kakao/callback
// 카카오 OAuth 인증 후 호출되는 API
// ============================================================
export async function GET(request: NextRequest) {
  try {
    // ────────────────────────────────────────────────────────
    // STEP 1: Authorization Code 받기
    // ────────────────────────────────────────────────────────
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')          // 카카오에서 발급한 인증 코드
    const error = searchParams.get('error')        // 에러 발생 시

    // 에러 체크
    if (error || !code) {
      console.error('❌ 카카오 인증 실패:', error)
      return NextResponse.redirect(
        new URL('/login?error=kakao_auth_failed', request.url)
      )
    }

    console.log('✅ 카카오 인증 코드 수신:', code)

    // ────────────────────────────────────────────────────────
    // STEP 2: Access Token 발급 (카카오 서버)
    // ────────────────────────────────────────────────────────
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',              // 인증 타입
        client_id: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!,  // 카카오 앱 키
        redirect_uri: `${request.nextUrl.origin}/api/auth/kakao/callback`,  // Callback URL
        code,  // STEP 1에서 받은 인증 코드
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

    // tokenData 구조:
    // {
    //   access_token: "...",
    //   token_type: "bearer",
    //   refresh_token: "...",
    //   expires_in: 21599,
    //   scope: "profile_nickname profile_image account_email"
    // }

    // ────────────────────────────────────────────────────────
    // STEP 3: 사용자 정보 조회 (카카오 서버)
    // ────────────────────────────────────────────────────────
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,  // Access Token 사용
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

    // userData 구조:
    // {
    //   id: 3740123456,  // 카카오 사용자 고유 ID
    //   kakao_account: {
    //     profile: {
    //       nickname: "홍길동",
    //       profile_image_url: "http://...",
    //     },
    //     email: "hong@kakao.com"
    //   }
    // }

    // 필요한 정보 추출
    const kakaoAccount = userData.kakao_account
    const profile = kakaoAccount.profile
    const email = kakaoAccount.email
    const name = profile.nickname || email?.split('@')[0] || '사용자'
    const profileImageUrl = profile.profile_image_url

    // ────────────────────────────────────────────────────────
    // STEP 4: Firebase UID 생성
    // ────────────────────────────────────────────────────────
    // 카카오 ID를 Firebase UID로 변환
    // 예: 카카오 ID 3740123456 → Firebase UID "kakao_3740123456"
    const firebaseUid = `kakao_${userData.id}`

    // ────────────────────────────────────────────────────────
    // STEP 5: Firebase Authentication 처리
    // ────────────────────────────────────────────────────────
    let isNewUser = false  // 신규 사용자 여부

    try {
      // 기존 사용자 확인
      await admin.auth().getUser(firebaseUid)
      console.log('✅ 기존 Firebase Auth 사용자 확인:', firebaseUid)
    } catch (error: any) {
      // 사용자가 없으면 생성
      if (error.code === 'auth/user-not-found') {
        console.log('💾 새 Firebase Auth 사용자 생성:', firebaseUid)
        isNewUser = true

        await admin.auth().createUser({
          uid: firebaseUid,
          email: email || `kakao_${userData.id}@kakao.local`,  // 이메일 없으면 임시 이메일
          displayName: name,
          photoURL: profileImageUrl,
        })
      } else {
        throw error  // 다른 에러는 상위로 전달
      }
    }

    // ────────────────────────────────────────────────────────
    // STEP 6: Firestore 데이터 저장 (Admin SDK 사용!)
    // ────────────────────────────────────────────────────────
    // ⚠️ 중요: 서버에서는 Admin SDK를 사용해야 함
    // 클라이언트 SDK(firebase/firestore)는 서버에서 사용 불가!

    const userRef = adminDb.collection('users').doc(firebaseUid)
    const userDoc = await userRef.get()

    if (!userDoc.exists || isNewUser) {
      // 신규 사용자: 새 문서 생성
      console.log('💾 Firestore에 사용자 정보 저장:', firebaseUid)
      const now = admin.firestore.Timestamp.now()

      await userRef.set({
        uid: firebaseUid,
        email: email || `kakao_${userData.id}@kakao.local`,
        name,
        role: 'user',  // 기본 역할
        profileImageUrl: profileImageUrl || null,
        createdAt: now,
        updatedAt: now,
      })

      console.log('✅ Firestore 사용자 정보 저장 완료')
    } else {
      // 기존 사용자: 프로필 정보 업데이트
      console.log('✅ 기존 Firestore 사용자 확인')

      await userRef.update({
        name,  // 닉네임 변경 반영
        profileImageUrl: profileImageUrl || null,  // 프로필 사진 변경 반영
        updatedAt: admin.firestore.Timestamp.now(),
      })

      console.log('✅ Firestore 사용자 정보 업데이트 완료')
    }

    // ────────────────────────────────────────────────────────
    // STEP 7: Custom Token 발급 (Firebase Admin)
    // ────────────────────────────────────────────────────────
    // Custom Token: 서버에서 발급하는 일회용 로그인 토큰
    // 클라이언트에서 이 토큰으로 Firebase Auth에 로그인 가능
    const customToken = await admin.auth().createCustomToken(firebaseUid)
    console.log('✅ Custom Token 발급 완료')

    // ────────────────────────────────────────────────────────
    // STEP 8: Success 페이지로 리다이렉트
    // ────────────────────────────────────────────────────────
    // Custom Token을 URL 파라미터로 전달
    return NextResponse.redirect(
      new URL(`/auth/kakao/success?token=${customToken}`, request.url)
    )

  } catch (error) {
    console.error('❌ 카카오 로그인 콜백 오류:', error)
    return NextResponse.redirect(
      new URL('/login?error=callback_failed', request.url)
    )
  }
}
```

**핵심 개념:**

1. **Admin SDK vs Client SDK**
   - Admin SDK: 서버에서 사용, 모든 권한 보유, 보안 키 필요
   - Client SDK: 브라우저에서 사용, 제한된 권한, 보안 규칙 적용

2. **왜 Admin SDK를 사용하는가?**
   - Firestore 보안 규칙을 우회하여 데이터 저장 가능
   - Custom Token 발급 가능 (Client SDK로는 불가능)
   - 서버 환경에서만 실행되므로 Private Key 노출 위험 없음

3. **Custom Token 방식의 장점**
   - 서버에서 사용자 인증 완료 후 토큰 발급
   - 클라이언트는 토큰만 받아서 로그인
   - 보안성 높음 (카카오 Access Token이 클라이언트에 노출되지 않음)

---

### STEP 5: Success 페이지 구현

#### `src/app/auth/kakao/success/page.tsx`
```typescript
'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithCustomToken } from 'firebase/auth'
import { auth } from '@/lib/firebase'

// ============================================================
// 실제 로그인 처리 컴포넌트
// ============================================================
function KakaoSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleKakaoLogin = async () => {
      // ──────────────────────────────────────────────────────
      // STEP 1: URL에서 Custom Token 추출
      // ──────────────────────────────────────────────────────
      const token = searchParams.get('token')

      if (!token) {
        console.error('❌ Custom Token이 없습니다.')
        router.push('/login?error=no_token')
        return
      }

      try {
        // ────────────────────────────────────────────────────
        // STEP 2: Firebase Client SDK로 로그인
        // ────────────────────────────────────────────────────
        console.log('🔥 Firebase Custom Token으로 로그인 시작')

        // Custom Token으로 로그인
        // 이 과정에서 Firebase Auth State가 업데이트됨
        const userCredential = await signInWithCustomToken(auth, token)

        console.log('✅ Firebase 로그인 성공:', userCredential.user.uid)
        console.log('📧 이메일:', userCredential.user.email)
        console.log('👤 이름:', userCredential.user.displayName)

        // ────────────────────────────────────────────────────
        // STEP 3: 로그인 완료 → 메인 페이지로 이동
        // ────────────────────────────────────────────────────
        // 이제 전역적으로 로그인 상태가 유지됨
        // onAuthStateChanged 리스너가 자동으로 감지
        router.push('/')

      } catch (error) {
        console.error('❌ Firebase 로그인 실패:', error)
        router.push('/login?error=firebase_signin_failed')
      }
    }

    handleKakaoLogin()
  }, [searchParams, router])

  // ────────────────────────────────────────────────────────
  // 로딩 화면
  // ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">카카오 로그인 처리 중...</p>
      </div>
    </div>
  )
}

// ============================================================
// Suspense로 감싸기 (useSearchParams 사용 시 필수!)
// ============================================================
export default function KakaoSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    }>
      <KakaoSuccessContent />
    </Suspense>
  )
}
```

**학습 포인트:**

1. **useSearchParams와 Suspense**
   - Next.js 14+에서 `useSearchParams()` 사용 시 반드시 Suspense로 감싸야 함
   - 이유: Server Component에서 동적 데이터 처리를 위한 스트리밍

2. **signInWithCustomToken**
   - Custom Token을 사용한 Firebase 로그인
   - 성공 시 `auth.currentUser`가 자동으로 설정됨
   - `onAuthStateChanged` 리스너가 트리거됨

3. **로그인 상태 관리**
   - Firebase Auth가 자동으로 세션 관리
   - 새로고침해도 로그인 상태 유지
   - 로그아웃 전까지 유효

---

## 환경 변수 설정

### 개발 환경 (`.env.development`)
```bash
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Kakao Login
NEXT_PUBLIC_KAKAO_JS_KEY=your-kakao-js-key

# Firebase Admin SDK (절대 공개 금지!)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 운영 환경 (Vercel)
1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **Settings** > **Environment Variables**
4. 위 환경 변수들을 하나씩 추가
5. **Environment**: Production 선택

**주의 사항:**
- `FIREBASE_PRIVATE_KEY`는 반드시 큰따옴표로 감싸기
- 줄바꿈은 `\n` 문자열로 유지
- Git에 절대 커밋하지 말 것 (`.gitignore`에 `.env*` 추가)

---

## 테스트 방법

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 브라우저에서 테스트
1. http://localhost:3000/login 접속
2. **카카오 로그인** 버튼 클릭
3. 카카오 로그인 페이지에서 로그인
4. 동의 항목 확인 후 **동의하고 계속하기**
5. 자동으로 메인 페이지로 리다이렉트

### 3. Firebase Console 확인
#### Authentication 확인
1. Firebase Console > **Authentication**
2. **Users** 탭
3. `kakao_` 접두사가 붙은 사용자 확인

#### Firestore 확인
1. Firebase Console > **Firestore Database**
2. **users** 컬렉션 선택
3. 사용자 문서 확인:
   ```
   Document ID: kakao_3740123456
   Fields:
   - uid: "kakao_3740123456"
   - email: "hong@kakao.com"
   - name: "홍길동"
   - role: "user"
   - profileImageUrl: "http://..."
   - createdAt: Timestamp
   - updatedAt: Timestamp
   ```

### 4. 브라우저 개발자 도구 확인
1. F12 → **Console** 탭
2. 로그 확인:
   ```
   ✅ 카카오 인증 코드 수신: abc123...
   ✅ 액세스 토큰 발급 완료
   📥 카카오 사용자 정보: {...}
   ✅ 기존 Firebase Auth 사용자 확인: kakao_3740123456
   ✅ Firestore 사용자 정보 업데이트 완료
   ✅ Custom Token 발급 완료
   🔥 Firebase Custom Token으로 로그인 시작
   ✅ Firebase 로그인 성공: kakao_3740123456
   ```

---

## 트러블슈팅

### 문제 1: "redirect_uri mismatch" 에러
**원인:** 카카오 개발자 콘솔에 Redirect URI가 등록되지 않음

**해결:**
1. 카카오 개발자 콘솔 > **제품 설정** > **카카오 로그인**
2. **Redirect URI** 등록:
   ```
   http://localhost:3000/api/auth/kakao/callback
   ```
3. **저장** 클릭

---

### 문제 2: "Failed to load Firebase Admin credentials" 에러
**원인:** 환경 변수 `FIREBASE_PRIVATE_KEY`가 올바르게 설정되지 않음

**해결:**
1. `.env.development` 파일 확인
2. `FIREBASE_PRIVATE_KEY` 값이 큰따옴표로 감싸져 있는지 확인
3. `\n`이 실제 줄바꿈이 아닌 문자열 `\n`인지 확인
4. 개발 서버 재시작:
   ```bash
   # Ctrl+C로 중지 후
   npm run dev
   ```

---

### 문제 3: Firestore에 데이터가 저장되지 않음
**원인:** 클라이언트 SDK를 서버에서 사용하려고 함

**해결:**
- Callback API에서 반드시 Admin SDK 사용:
  ```typescript
  // ❌ 잘못된 방법 (클라이언트 SDK)
  import { doc, setDoc } from 'firebase/firestore'
  import { db } from '@/lib/firebase'

  // ✅ 올바른 방법 (Admin SDK)
  import * as admin from 'firebase-admin'
  const adminDb = admin.firestore()
  await adminDb.collection('users').doc(uid).set(data)
  ```

---

### 문제 4: "CORS policy" 에러
**원인:** 카카오 API 요청 시 CORS 설정 문제

**해결:**
- Callback API는 **서버 사이드**에서 실행되므로 CORS 문제 없음
- 클라이언트에서 카카오 API를 직접 호출하지 말 것
- Next.js API Routes(`/api/...`)를 통해서만 호출

---

### 문제 5: Custom Token 에러
**원인:** Firebase Admin SDK 초기화 실패 또는 UID 형식 오류

**해결:**
1. Firebase Admin SDK 초기화 확인
2. UID가 올바른 형식인지 확인 (`kakao_` 접두사 필수)
3. Firebase Console에서 해당 UID의 사용자가 존재하는지 확인

---

## 보안 체크리스트

### ✅ 환경 변수 보안
- [ ] `.env*` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] `FIREBASE_PRIVATE_KEY`가 절대 Git에 커밋되지 않았는가?
- [ ] Vercel 환경 변수가 Production으로 설정되어 있는가?

### ✅ API 보안
- [ ] Callback API가 서버에서만 실행되는가? (Client에서 직접 호출 불가)
- [ ] Firebase Admin SDK가 서버에서만 사용되는가?
- [ ] Custom Token이 URL 파라미터로 전달되지만 HTTPS로 보호되는가?

### ✅ Firestore 보안
- [ ] Firestore 보안 규칙이 설정되어 있는가?
- [ ] 사용자가 자신의 데이터만 접근할 수 있는가?
- [ ] Admin 역할이 필요한 데이터는 별도로 보호되는가?

---

## 참고 자료

### 공식 문서
- [카카오 로그인 REST API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Custom Token](https://firebase.google.com/docs/auth/admin/create-custom-tokens)

### 추가 학습
- OAuth 2.0 개념
- JWT (JSON Web Token) 이해
- Firebase Security Rules 작성법

---

## 마무리

이 가이드를 통해 학습한 내용:

1. **OAuth 2.0 인증 흐름**
   - Authorization Code 방식
   - Access Token 발급 및 사용
   - Redirect URI 처리

2. **Firebase Admin SDK**
   - 서버 환경에서 Firebase 제어
   - Custom Token 발급
   - Firestore 직접 접근

3. **보안 모범 사례**
   - 환경 변수 관리
   - Client/Server 권한 분리
   - Private Key 보호

4. **Next.js API Routes**
   - 서버 사이드 API 구현
   - 환경 변수 접근
   - 리다이렉트 처리

**다음 단계:**
- 로그아웃 기능 구현
- 프로필 수정 기능
- 역할 기반 권한 관리 (RBAC)
- 소셜 로그인 추가 (Google, Naver 등)
