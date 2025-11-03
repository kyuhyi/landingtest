# BSD 바이브코딩 온라인 강의 플랫폼

Next.js 16 + Firebase 기반의 온라인 강의 판매 및 수강 관리 플랫폼

## 📚 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [주요 기능](#주요-기능)
4. [프로젝트 구조](#프로젝트-구조)
5. [설치 및 실행](#설치-및-실행)
6. [Firebase 설정](#firebase-설정)
7. [문서 목록](#문서-목록)

---

## 프로젝트 개요

**BSD 바이브코딩**은 온라인 코딩 교육 플랫폼으로, 다음 기능을 제공합니다:

- 강의 소개 및 상세 페이지
- 결제 시스템 (Toss Payments)
- 소셜 로그인 (Google, Kakao)
- 마이페이지 (주문 내역, 프로필 관리)
- 리뷰 시스템 (별점, 사진 업로드)
- 관리자 대시보드

---

## 기술 스택

### Frontend
- **Next.js 16.0.1** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (아이콘)

### Backend & Database
- **Firebase Authentication** (소셜 로그인)
- **Firebase Firestore** (NoSQL 데이터베이스)
- **Firebase Storage** (이미지 저장)

### Payment
- **Toss Payments** (결제 게이트웨이)

### Deployment
- **Vercel** (권장)

---

## 주요 기능

### 1. 인증 시스템
- Google 소셜 로그인
- Kakao 소셜 로그인 (OIDC)
- 자동 회원 정보 저장 (Firestore)

### 2. 상품 관리
- 강의 목록 및 상세 페이지
- 커리큘럼, 특징, 추천 대상 표시
- 상품별 가격 및 난이도 정보

### 3. 결제 시스템
- Toss Payments 연동
- 결제 성공/실패 처리
- 주문 내역 Firestore 저장

### 4. 마이페이지
- 내 정보 관리 (이름, 전화번호 수정)
- 주문 내역 조회
- 최근 주문 위젯

### 5. 리뷰 시스템
- 별점 (1-5점) 작성
- 텍스트 리뷰 (최소 10자)
- 이미지 업로드 (최대 4장, 각 5MB 이하)
- 리뷰 통계 (평균 별점, 별점별 분포)

### 6. 관리자 대시보드
- 통계 대시보드 (매출, 사용자, 주문)
- 사용자 관리
- 주문 관리
- 상품 관리

---

## 프로젝트 구조

```
c:\project\landing\
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # 홈페이지
│   │   ├── login/page.tsx            # 로그인 페이지
│   │   ├── products/
│   │   │   ├── page.tsx              # 강의 목록
│   │   │   └── [id]/page.tsx         # 강의 상세
│   │   ├── payment/
│   │   │   ├── page.tsx              # 결제 페이지
│   │   │   └── success/page.tsx      # 결제 성공
│   │   ├── mypage/
│   │   │   ├── page.tsx              # 마이페이지
│   │   │   ├── profile/page.tsx      # 내 정보
│   │   │   └── orders/page.tsx       # 주문 내역
│   │   ├── admin/page.tsx            # 관리자 대시보드
│   │   └── api/
│   │       └── payment/
│   │           └── confirm/route.ts  # 결제 승인 API
│   ├── components/                   # React 컴포넌트
│   │   ├── Header.tsx                # 헤더 (로그인 상태)
│   │   ├── ProductReviews.tsx        # 리뷰 목록 표시
│   │   ├── ReviewWriteModal.tsx      # 리뷰 작성 모달
│   │   └── layout/
│   │       ├── PageHeader.tsx        # 페이지 헤더
│   │       └── MypageSidebar.tsx     # 마이페이지 사이드바
│   ├── lib/                          # 유틸리티 함수
│   │   ├── firebase.ts               # Firebase 초기화
│   │   ├── auth-context.tsx          # 인증 컨텍스트
│   │   ├── firestore-utils.ts        # Firestore CRUD
│   │   └── storage-utils.ts          # Storage 업로드
│   ├── data/
│   │   └── products.ts               # 상품 데이터
│   └── types/
│       └── firestore.ts              # TypeScript 타입
├── docs/                             # 프로젝트 문서
│   ├── README.md                     # 프로젝트 개요 (이 파일)
│   ├── SETUP.md                      # 설치 및 설정 가이드
│   ├── ARCHITECTURE.md               # 아키텍처 설계
│   ├── API.md                        # API 문서
│   └── TROUBLESHOOTING.md            # 문제 해결 가이드
├── FIRESTORE_INDEX_FIX.md            # Firestore 인덱스 설정
├── KAKAO_LOGIN_FIX.md                # Kakao 로그인 설정
├── REVIEW_INDEX_SETUP.md             # 리뷰 인덱스 설정
├── .env.local                        # 환경 변수 (Git 제외)
└── package.json                      # 의존성 관리
```

---

## 설치 및 실행

### 1. 저장소 클론 및 의존성 설치

```bash
cd c:/project/landing
npm install
```

### 2. 환경 변수 설정

**⚠️ 중요: 환경 변수 파일은 절대 Git에 커밋하지 마세요!**

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
# .env.example 파일을 복사하여 시작
cp .env.example .env.local       # Mac/Linux
copy .env.example .env.local     # Windows
```

#### 필수 환경 변수

**Firebase 설정** (7개 필수):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Toss Payments 설정** (2개 필수):
```env
# 개발 환경 (테스트 키)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...

# 운영 환경 (실제 결제용 - 프로덕션에서만 사용)
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_...
TOSS_SECRET_KEY=live_sk_...
```

#### 환경 변수 확인 방법

1. Firebase 키 확인: [Firebase Console](https://console.firebase.google.com) → 프로젝트 설정 → 일반 → 내 앱
2. Toss Payments 키 확인: [Toss 개발자센터](https://developers.tosspayments.com/) → 내 앱 → API 키

#### 보안 주의사항

- ✅ `.gitignore`에 `.env*` 파일이 이미 추가되어 있습니다
- ✅ `NEXT_PUBLIC_` 접두사가 있는 변수는 브라우저에 노출됩니다
- ⚠️ `TOSS_SECRET_KEY`는 서버에서만 사용되며 절대 클라이언트에 노출하지 마세요
- ⚠️ 운영 환경에서는 Vercel/환경변수 관리 도구를 사용하세요

### 3. 개발 서버 실행

```bash
npm run dev
```

접속: http://localhost:3000

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

---

## Firebase 설정

### 1. Firebase 프로젝트 생성

1. https://console.firebase.google.com 접속
2. 새 프로젝트 생성: `bsd-test-6de41`
3. Google Analytics 활성화 (선택)

### 2. Authentication 설정

1. **Authentication** → **Sign-in method**
2. **Google** 활성화
3. **OIDC** 제공업체 추가:
   - 제공업체 ID: `oidc.kakao`
   - 클라이언트 ID: Kakao REST API 키
   - 발급자: `https://kauth.kakao.com`

[상세 가이드: KAKAO_LOGIN_FIX.md](../KAKAO_LOGIN_FIX.md)

### 3. Firestore Database 설정

1. **Firestore Database** 생성
2. 위치: `asia-northeast3 (서울)`
3. 모드: **프로덕션 모드**

#### 보안 규칙:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null;
    }

    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### 필수 인덱스:

**orders 컬렉션:**
- `userId` (오름차순) + `createdAt` (내림차순)

**reviews 컬렉션:**
- `productId` (오름차순) + `createdAt` (내림차순)

[상세 가이드: FIRESTORE_INDEX_FIX.md](../FIRESTORE_INDEX_FIX.md)
[리뷰 인덱스: REVIEW_INDEX_SETUP.md](../REVIEW_INDEX_SETUP.md)

### 4. Firebase Storage 설정

1. **Storage** 활성화
2. 위치: `asia-northeast3 (서울)`

#### 보안 규칙:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reviews/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    match /profiles/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

---

## 문서 목록

프로젝트 관련 상세 문서는 `docs/` 폴더에 있습니다:

| 문서 | 설명 |
|------|------|
| [SETUP.md](./SETUP.md) | 개발 환경 설정 가이드 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 시스템 아키텍처 설계 |
| [API.md](./API.md) | API 엔드포인트 문서 |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | 자주 발생하는 문제 해결 |

루트 폴더의 설정 가이드:

| 문서 | 설명 |
|------|------|
| [FIRESTORE_INDEX_FIX.md](../FIRESTORE_INDEX_FIX.md) | Firestore 인덱스 생성 |
| [KAKAO_LOGIN_FIX.md](../KAKAO_LOGIN_FIX.md) | Kakao 로그인 설정 |
| [REVIEW_INDEX_SETUP.md](../REVIEW_INDEX_SETUP.md) | 리뷰 시스템 인덱스 |

---

## 라이선스

이 프로젝트는 BSD 바이브코딩의 소유입니다.

---

## 지원

문의사항: support@bsdcoding.com
