# 개발 환경 설정 가이드

BSD 바이브코딩 프로젝트의 개발 환경 설정 단계별 가이드

## 목차

1. [사전 요구사항](#사전-요구사항)
2. [프로젝트 설정](#프로젝트-설정)
3. [Firebase 설정](#firebase-설정)
4. [Toss Payments 설정](#toss-payments-설정)
5. [Kakao Developers 설정](#kakao-developers-설정)
6. [개발 서버 실행](#개발-서버-실행)
7. [배포 설정](#배포-설정)

---

## 사전 요구사항

### 필수 소프트웨어

| 소프트웨어 | 버전 | 설치 방법 |
|-----------|------|----------|
| Node.js | 18.0.0 이상 | https://nodejs.org |
| npm | 9.0.0 이상 | Node.js와 함께 설치 |
| Git | 최신 버전 | https://git-scm.com |
| VS Code | 권장 | https://code.visualstudio.com |

### 버전 확인

```bash
node -v    # v18.0.0 이상
npm -v     # v9.0.0 이상
git --version
```

### VS Code 확장 프로그램 (권장)

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **Firebase**

---

## 프로젝트 설정

### 1. 저장소 클론 (또는 기존 프로젝트 사용)

```bash
# 기존 프로젝트 디렉터리로 이동
cd c:/project/landing
```

### 2. 의존성 설치

```bash
npm install
```

**설치되는 주요 패키지:**
- `next@16.0.1` - Next.js 프레임워크
- `react@19` - React 라이브러리
- `firebase@11` - Firebase SDK
- `@toss/tosspayments-next` - Toss Payments SDK
- `lucide-react` - 아이콘 라이브러리
- `tailwindcss` - CSS 프레임워크

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# .env.local 파일 생성
touch .env.local
```

**파일 내용:**

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Toss Payments
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
```

**중요:**
- `NEXT_PUBLIC_` 접두사: 클라이언트에서 접근 가능
- 접두사 없음: 서버에서만 접근 가능 (보안)
- `.env.local`은 Git에 커밋하지 않음 (`.gitignore`에 포함)

---

## Firebase 설정

### 1. Firebase 프로젝트 생성

1. https://console.firebase.google.com 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름 입력: `bsd-test-6de41` (또는 원하는 이름)
4. Google Analytics 활성화 (선택)
5. **프로젝트 만들기** 클릭

### 2. 웹 앱 등록

1. 프로젝트 대시보드에서 **웹 아이콘** 클릭
2. 앱 닉네임 입력: `BSD Vibe Coding`
3. Firebase Hosting 설정 (선택)
4. **앱 등록** 클릭
5. **firebaseConfig** 객체 복사 → `.env.local`에 붙여넣기

**예제:**
```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "xxx.firebaseapp.com",  // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "xxx",               // NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "xxx.appspot.com",   // NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123...",    // NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123..."               // NEXT_PUBLIC_FIREBASE_APP_ID
};
```

### 3. Authentication 설정

#### Google 로그인 활성화

1. Firebase Console → **Authentication**
2. **Sign-in method** 탭 클릭
3. **Google** 클릭
4. **사용 설정** 토글 ON
5. 프로젝트 공개용 이름 입력
6. 지원 이메일 선택
7. **저장** 클릭

#### Kakao 로그인 설정 (OIDC)

1. **Sign-in method** → **새 제공업체 추가**
2. **OIDC** 선택
3. 다음 정보 입력:
   - **제공업체 이름**: `Kakao`
   - **제공업체 ID**: `oidc.kakao`
   - **클라이언트 ID**: (Kakao REST API 키 - 아래 섹션 참조)
   - **발급자(Issuer)**: `https://kauth.kakao.com`
4. **사용 설정** ON
5. **저장**

**상세 가이드:** [KAKAO_LOGIN_FIX.md](../KAKAO_LOGIN_FIX.md)

### 4. Firestore Database 설정

#### 데이터베이스 생성

1. Firebase Console → **Firestore Database**
2. **데이터베이스 만들기** 클릭
3. **프로덕션 모드로 시작** 선택
4. 위치 선택: `asia-northeast3 (서울)` 권장
5. **사용 설정** 클릭

#### 보안 규칙 설정

1. **Rules** 탭 클릭
2. 다음 규칙으로 교체:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 컬렉션
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // 주문 컬렉션
    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null;
    }

    // 리뷰 컬렉션
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. **게시** 클릭

#### 인덱스 생성

**필요한 복합 인덱스:**

1. **orders 컬렉션:**
   - 컬렉션 ID: `orders`
   - 필드: `userId` (오름차순), `createdAt` (내림차순)

2. **reviews 컬렉션:**
   - 컬렉션 ID: `reviews`
   - 필드: `productId` (오름차순), `createdAt` (내림차순)

**생성 방법:**
- 앱 실행 중 에러 메시지의 링크 클릭 (자동 생성)
- 또는 수동으로 Firebase Console → Firestore → 인덱스에서 추가

**참고:** [FIRESTORE_INDEX_FIX.md](../FIRESTORE_INDEX_FIX.md)

### 5. Firebase Storage 설정

#### Storage 활성화

1. Firebase Console → **Storage**
2. **시작하기** 클릭
3. 보안 규칙 모드 선택 (프로덕션 모드)
4. 위치 선택: `asia-northeast3 (서울)` 권장
5. **완료** 클릭

#### 보안 규칙 설정

1. **Rules** 탭 클릭
2. 다음 규칙으로 교체:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 리뷰 이미지
    match /reviews/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // 프로필 이미지
    match /profiles/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

3. **게시** 클릭

**참고:** [REVIEW_INDEX_SETUP.md](../REVIEW_INDEX_SETUP.md)

---

## Toss Payments 설정

### 1. Toss Payments 회원가입

1. https://www.tosspayments.com 접속
2. **개발자 시작하기** 클릭
3. 계정 생성 및 로그인

### 2. 테스트 키 발급

1. Toss Payments 개발자센터 로그인
2. **내 정보** → **API 키** 탭
3. **테스트 키** 섹션에서:
   - **클라이언트 키** 복사 → `.env.local`의 `NEXT_PUBLIC_TOSS_CLIENT_KEY`
   - **시크릿 키** 복사 → `.env.local`의 `TOSS_SECRET_KEY`

**예제:**
```env
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_DpexMgkW36Wj1abcd1234
TOSS_SECRET_KEY=test_sk_zXLkKEypNArWmo09efgh5678
```

### 3. 프로덕션 키 발급 (실제 서비스 시)

1. 사업자 등록증 제출
2. Toss Payments 승인 대기
3. **라이브 키** 발급 받기
4. `.env.local`의 키를 라이브 키로 교체

**주의:**
- 테스트 환경에서는 실제 결제 안 됨
- 프로덕션 환경에서만 라이브 키 사용
- 시크릿 키는 절대 클라이언트에 노출 금지

---

## Kakao Developers 설정

### 1. Kakao Developers 계정 생성

1. https://developers.kakao.com 접속
2. 카카오 계정으로 로그인
3. 개발자 약관 동의

### 2. 애플리케이션 등록

1. **내 애플리케이션** 메뉴 클릭
2. **애플리케이션 추가하기** 클릭
3. 앱 정보 입력:
   - **앱 이름**: `BSD 바이브코딩`
   - **사업자명**: 본인 또는 회사명
   - **카테고리**: `교육`
4. **저장** 클릭

### 3. REST API 키 확인

1. 앱 설정 페이지 → **앱 키** 탭
2. **REST API 키** 복사
3. Firebase Console → Authentication → OIDC 제공업체 → **클라이언트 ID**에 붙여넣기

### 4. 플랫폼 설정

1. **플랫폼** 메뉴 클릭
2. **Web 플랫폼 등록** 클릭
3. **사이트 도메인** 입력:
   ```
   http://localhost:3000
   ```
4. **저장** 클릭

### 5. Redirect URI 설정

1. **제품 설정** → **카카오 로그인** 클릭
2. **카카오 로그인 활성화**: **ON**
3. **Redirect URI 등록** 클릭
4. URI 추가:
   ```
   https://bsd-test-6de41.firebaseapp.com/__/auth/handler
   ```
   (Firebase 프로젝트 ID에 맞게 수정)
5. **저장** 클릭

### 6. 동의 항목 설정

1. **제품 설정** → **카카오 로그인** → **동의 항목**
2. 다음 항목을 **필수 동의**로 설정:
   - ✅ **닉네임**
   - ✅ **프로필 이미지**
   - ✅ **카카오계정(이메일)**
3. **저장** 클릭

**상세 가이드:** [KAKAO_LOGIN_FIX.md](../KAKAO_LOGIN_FIX.md)

---

## 개발 서버 실행

### 1. 환경 변수 확인

```bash
# .env.local 파일이 프로젝트 루트에 있는지 확인
ls .env.local
```

### 2. 개발 서버 시작

```bash
npm run dev
```

**출력:**
```
▲ Next.js 16.0.1 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

### 3. 브라우저에서 확인

1. http://localhost:3000 접속
2. 홈페이지 정상 표시 확인
3. **로그인** 버튼 클릭 → Google/Kakao 로그인 테스트

### 4. 콘솔 로그 확인

브라우저 개발자 도구 (F12) → Console 탭:

**성공 시:**
```
🔥 Firebase 초기화 완료
👤 사용자 프로필 로딩: {id: "...", email: "...", ...}
```

**에러 시:**
```
❌ Firebase 초기화 실패: ...
```

→ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 참조

---

## 배포 설정

### Vercel 배포

#### 1. Vercel CLI 설치

```bash
npm i -g vercel
```

#### 2. 프로젝트 링크

```bash
vercel link
```

#### 3. 환경 변수 설정

```bash
# Firebase 설정
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

# Toss Payments
vercel env add NEXT_PUBLIC_TOSS_CLIENT_KEY production
vercel env add TOSS_SECRET_KEY production
```

#### 4. 배포

```bash
# 프로덕션 배포
vercel --prod
```

#### 5. 배포 후 설정

**Firebase Console:**
1. Authentication → Settings → **Authorized domains**
2. Vercel 도메인 추가: `your-app.vercel.app`

**Kakao Developers:**
1. 플랫폼 → Web → 사이트 도메인 추가: `https://your-app.vercel.app`
2. Redirect URI 추가: `https://bsd-test-6de41.firebaseapp.com/__/auth/handler`

---

## 프로덕션 체크리스트

배포 전 확인 사항:

- [ ] `.env.local` 파일이 Git에 커밋되지 않았는지 확인
- [ ] Vercel에 모든 환경 변수 설정 완료
- [ ] Firebase Firestore 인덱스 생성 완료
- [ ] Firebase Storage 보안 규칙 설정 완료
- [ ] Toss Payments 라이브 키로 교체 (실제 결제 시)
- [ ] Kakao 로그인 Redirect URI에 프로덕션 도메인 추가
- [ ] Firebase Authorized domains에 프로덕션 도메인 추가
- [ ] 테스트 결제 성공 확인
- [ ] 리뷰 작성 (이미지 포함) 테스트 완료
- [ ] 관리자 대시보드 접근 권한 확인

---

## 문제 해결

개발 중 문제가 발생하면 다음 문서를 참조하세요:

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 일반적인 문제 해결
- [FIRESTORE_INDEX_FIX.md](../FIRESTORE_INDEX_FIX.md) - Firestore 인덱스 에러
- [KAKAO_LOGIN_FIX.md](../KAKAO_LOGIN_FIX.md) - Kakao 로그인 문제
- [REVIEW_INDEX_SETUP.md](../REVIEW_INDEX_SETUP.md) - 리뷰 시스템 설정

---

## 다음 단계

개발 환경 설정이 완료되었습니다! 이제:

1. [ARCHITECTURE.md](./ARCHITECTURE.md)에서 시스템 구조 확인
2. [API.md](./API.md)에서 API 사용법 학습
3. 코드 수정 및 기능 추가 시작

Happy Coding! 🚀
