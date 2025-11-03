# 시스템 아키텍처

BSD 바이브코딩 온라인 강의 플랫폼의 아키텍처 설계 문서

## 목차

1. [전체 아키텍처](#전체-아키텍처)
2. [기술 스택](#기술-스택)
3. [데이터 모델](#데이터-모델)
4. [인증 시스템](#인증-시스템)
5. [결제 플로우](#결제-플로우)
6. [리뷰 시스템](#리뷰-시스템)

---

## 전체 아키텍처

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │
       │ HTTPS
       │
┌──────▼──────────────────────────────────────┐
│          Next.js 16 (App Router)            │
│  ┌─────────────┐  ┌──────────────────────┐ │
│  │   Pages     │  │   API Routes         │ │
│  │  (React)    │  │  /api/payment/...    │ │
│  └─────────────┘  └──────────────────────┘ │
└──────┬──────────────────┬──────────────────┘
       │                  │
       │                  │ Server-side
       │                  │
┌──────▼──────────┐  ┌────▼────────────┐
│    Firebase     │  │ Toss Payments   │
│  - Auth         │  │   Gateway       │
│  - Firestore    │  └─────────────────┘
│  - Storage      │
└─────────────────┘
```

---

## 기술 스택

### Frontend Layer

**Next.js 16 App Router**
- Server Components: 초기 렌더링 최적화
- Client Components: 상호작용 (로그인, 결제, 리뷰)
- Turbopack: 빠른 개발 환경
- Image Optimization: `next/image`

**React 19**
- Hooks: `useState`, `useEffect`, `useContext`
- Context API: 인증 상태 관리 (`AuthContext`)
- Suspense: 비동기 데이터 로딩

**Styling**
- Tailwind CSS: 유틸리티 기반 스타일링
- CSS Variables: 테마 색상 관리
- Responsive Design: 모바일 우선

### Backend Layer

**Firebase**
- **Authentication**: 소셜 로그인 (Google, Kakao OIDC)
- **Firestore**: NoSQL 데이터베이스
- **Storage**: 이미지 저장 (리뷰, 프로필)

**API Routes**
- `/api/payment/confirm`: 결제 승인 (서버 사이드)

**Third-party**
- **Toss Payments**: 결제 게이트웨이

---

## 데이터 모델

### Firestore Collections

#### 1. users

사용자 정보 저장

```typescript
{
  id: string,                    // Firebase Auth UID
  email: string,                 // 이메일
  name: string,                  // 이름
  phoneNumber?: string,          // 전화번호
  provider: 'google' | 'kakao',  // 로그인 제공자
  photoURL?: string,             // 프로필 이미지
  createdAt: Timestamp,          // 가입일
  updatedAt: Timestamp           // 수정일
}
```

#### 2. orders

주문 내역 저장

```typescript
{
  id: string,                    // 주문 ID (orderId)
  userId: string,                // 사용자 ID
  userEmail: string,             // 사용자 이메일
  userName: string,              // 사용자 이름
  productId: string,             // 상품 ID
  productName: string,           // 상품명
  amount: number,                // 결제 금액
  status: 'pending' | 'completed' | 'cancelled',
  paymentKey: string,            // Toss Payments 키
  orderId: string,               // 주문 번호
  createdAt: Timestamp,          // 주문일
  updatedAt: Timestamp           // 수정일
}
```

**필수 인덱스:**
- `userId` (오름차순) + `createdAt` (내림차순)

#### 3. reviews

리뷰 저장

```typescript
{
  id: string,                    // 리뷰 ID
  productId: string,             // 상품 ID
  userId: string,                // 작성자 ID
  userName: string,              // 작성자 이름
  userEmail: string,             // 작성자 이메일
  userProfileImage?: string,     // 작성자 프로필 이미지
  rating: number,                // 별점 (1-5)
  content: string,               // 리뷰 내용
  images: string[],              // 이미지 URL 배열
  createdAt: Timestamp,          // 작성일
  updatedAt: Timestamp           // 수정일
}
```

**필수 인덱스:**
- `productId` (오름차순) + `createdAt` (내림차순)
- `userId` (오름차순) + `createdAt` (내림차순) - 선택

### Firebase Storage Structure

```
storage/
├── reviews/
│   ├── review_123_0_timestamp.jpg
│   ├── review_123_1_timestamp.png
│   └── ...
└── profiles/
    ├── userId_timestamp.jpg
    └── ...
```

---

## 인증 시스템

### Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. 로그인 버튼 클릭
     │
┌────▼─────────────┐
│  Login Page      │
│  /login          │
└────┬─────────────┘
     │ 2. Google/Kakao 선택
     │
┌────▼─────────────┐
│  Firebase Auth   │
│  - signInWith... │
└────┬─────────────┘
     │ 3. OAuth 인증
     │
┌────▼─────────────┐
│  AuthContext     │
│  - userProfile   │
│  - loading       │
└────┬─────────────┘
     │ 4. Firestore 저장
     │
┌────▼─────────────┐
│  users 컬렉션     │
│  (생성 or 업데이트)│
└──────────────────┘
```

### AuthContext 구조

```typescript
interface AuthContextType {
  user: User | null;              // Firebase Auth User
  userProfile: UserProfile | null; // Firestore 사용자 정보
  loading: boolean;                // 로딩 상태
  signInWithGoogle: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
  signOut: () => Promise<void>;
}
```

### 인증 보호 라우트

```typescript
// 보호가 필요한 페이지
if (!userProfile) {
  router.push('/login');
  return;
}
```

---

## 결제 플로우

### Payment Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. 상품 선택 + 결제하기
     │
┌────▼─────────────┐
│  Product Detail  │
│  /products/[id]  │
└────┬─────────────┘
     │ 2. 결제 페이지로 이동
     │    (productId, price)
     │
┌────▼─────────────┐
│  Payment Page    │
│  /payment        │
└────┬─────────────┘
     │ 3. Toss Payments 위젯 로드
     │    orderId 생성
     │
┌────▼─────────────┐
│  Toss Payments   │
│  결제 위젯       │
└────┬─────────────┘
     │ 4. 결제 승인 (카드, 계좌이체 등)
     │
┌────▼─────────────┐
│  Success Page    │
│  /payment/success│
└────┬─────────────┘
     │ 5. 서버 사이드 결제 승인
     │
┌────▼─────────────┐
│  API Route       │
│  /api/payment/   │
│  confirm         │
└────┬─────────────┘
     │ 6. Toss API 호출 (Secret Key)
     │
┌────▼─────────────┐
│  Firestore       │
│  orders 컬렉션    │
│  주문 저장       │
└──────────────────┘
```

### 결제 승인 API

**Endpoint:** `POST /api/payment/confirm`

**Request:**
```json
{
  "paymentKey": "string",
  "orderId": "string",
  "amount": "string"
}
```

**Process:**
1. Toss Payments API 호출 (서버 Secret Key 사용)
2. 결제 승인 성공 시 Firestore에 주문 저장
3. 실패 시 에러 반환

**Security:**
- Secret Key는 서버에서만 사용 (환경 변수)
- 클라이언트에는 노출되지 않음

---

## 리뷰 시스템

### Review Write Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. 리뷰 작성 버튼 클릭
     │
┌────▼─────────────┐
│  Product Detail  │
│  ProductReviews  │
└────┬─────────────┘
     │ 2. 리뷰 작성 모달 열기
     │
┌────▼─────────────┐
│ ReviewWriteModal │
│ - 별점 선택      │
│ - 내용 입력      │
│ - 이미지 선택    │
└────┬─────────────┘
     │ 3. 리뷰 등록 버튼
     │
┌────▼─────────────┐
│  이미지 업로드    │
│  Firebase Storage│
└────┬─────────────┘
     │ 4. 이미지 URL 반환
     │
┌────▼─────────────┐
│  Firestore       │
│  reviews 컬렉션   │
│  리뷰 저장       │
└────┬─────────────┘
     │ 5. 성공 알림 + 목록 새로고침
     │
┌────▼─────────────┐
│  Product Detail  │
│  리뷰 목록 갱신   │
└──────────────────┘
```

### Image Upload Process

```typescript
// 1. 파일 선택 (최대 4개, 각 5MB 이하)
const files = [file1, file2, file3];

// 2. 리뷰 ID 생성
const reviewId = `review_${Date.now()}_${userId}`;

// 3. 병렬 업로드
const uploadPromises = files.map((file, index) =>
  uploadReviewImage(reviewId, file, index)
);
const imageUrls = await Promise.all(uploadPromises);

// 4. Firestore에 리뷰 저장
await createReview({
  id: reviewId,
  productId,
  userId,
  rating,
  content,
  images: imageUrls  // Storage URLs
});
```

### Storage Path 구조

```
reviews/
  review_1234567890_userId_0_1234567890.jpg
  └─ reviewId ─┘ └─index─┘ └─timestamp─┘
```

---

## 성능 최적화

### 1. Image Optimization

```typescript
// next/image 사용
<Image
  src={product.image}
  alt={product.name}
  width={800}
  height={600}
  priority  // LCP 최적화
/>
```

### 2. Code Splitting

- App Router의 자동 코드 스플리팅
- Dynamic Import로 모달 컴포넌트 지연 로딩

### 3. Caching Strategy

- Static Generation: 홈페이지, 상품 목록
- Server-side Rendering: 상품 상세 (실시간 리뷰)
- Client-side Fetching: 마이페이지 (인증 필요)

### 4. Firestore 쿼리 최적화

```typescript
// 인덱스 활용
const q = query(
  collection(db, 'orders'),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc'),  // 인덱스 필요
  limit(10)
);
```

---

## 보안 설계

### 1. Firestore Security Rules

```javascript
// 사용자는 자신의 데이터만 수정
match /users/{userId} {
  allow read: if true;
  allow write: if request.auth.uid == userId;
}

// 주문은 본인만 조회
match /orders/{orderId} {
  allow read: if request.auth.uid == resource.data.userId;
  allow write: if request.auth != null;
}
```

### 2. Storage Security Rules

```javascript
// 이미지는 로그인 사용자만 업로드
match /reviews/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null
               && request.resource.size < 5 * 1024 * 1024
               && request.resource.contentType.matches('image/.*');
}
```

### 3. API Route 보안

```typescript
// Secret Key는 서버에서만 사용
const secretKey = process.env.TOSS_SECRET_KEY;
const authorization = Buffer.from(secretKey + ':').toString('base64');
```

### 4. XSS 방어

- React의 자동 이스케이프
- `dangerouslySetInnerHTML` 사용 금지
- Content Security Policy (CSP)

---

## 확장 가능성

### 향후 추가 기능

1. **강의 스트리밍**
   - Video.js 통합
   - HLS/DASH 지원

2. **학습 진도 관리**
   - Progress 컬렉션
   - 수강 완료율 추적

3. **Q&A 시스템**
   - 질문/답변 컬렉션
   - 실시간 알림 (FCM)

4. **쿠폰 시스템**
   - Coupon 컬렉션
   - 할인 적용 로직

5. **수료증 발급**
   - Certificate 컬렉션
   - PDF 생성 (jsPDF)

---

## 모니터링 및 로깅

### 1. Firebase Analytics

```typescript
import { logEvent } from 'firebase/analytics';

// 결제 완료 이벤트
logEvent(analytics, 'purchase', {
  transaction_id: orderId,
  value: amount,
  currency: 'KRW'
});
```

### 2. Error Tracking

```typescript
// 콘솔 로그 활용
console.log('✅ 성공:', data);
console.error('❌ 실패:', error);
```

### 3. Performance Monitoring

- Firebase Performance Monitoring
- Next.js Analytics (Vercel)
- Core Web Vitals 추적

---

## 배포 전략

### Vercel 배포

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 프로젝트 링크
vercel link

# 3. 환경 변수 설정
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY

# 4. 배포
vercel --prod
```

### 환경 변수 관리

- **Development**: `.env.local`
- **Production**: Vercel Dashboard

---

## 참고 자료

- [Next.js 16 문서](https://nextjs.org/docs)
- [Firebase 문서](https://firebase.google.com/docs)
- [Toss Payments 가이드](https://docs.tosspayments.com)
