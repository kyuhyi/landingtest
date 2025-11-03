# API 문서

BSD 바이브코딩 플랫폼의 API 엔드포인트 및 Firebase 함수 문서

## 목차

1. [API Routes](#api-routes)
2. [Firestore Utils](#firestore-utils)
3. [Storage Utils](#storage-utils)
4. [인증 함수](#인증-함수)

---

## API Routes

### POST /api/payment/confirm

결제 승인 API (서버 사이드)

**Endpoint:**
```
POST /api/payment/confirm
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "paymentKey": "string",    // Toss Payments 결제 키
  "orderId": "string",        // 주문 ID
  "amount": "string"          // 결제 금액 (문자열)
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "ORDER_20240101_123456",
    "paymentKey": "tgen_...",
    "status": "DONE",
    "approvedAt": "2024-01-01T12:00:00+09:00"
  }
}
```

**Error Response (400/500):**
```json
{
  "error": "결제 승인 실패",
  "details": "에러 메시지"
}
```

**구현 코드:**
```typescript
// src/app/api/payment/confirm/route.ts
export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = await request.json();

  // Toss Payments API 호출
  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const result = await response.json();
  return Response.json(result);
}
```

---

## Firestore Utils

### 사용자 관리

#### createUser()

새 사용자 생성

**함수 시그니처:**
```typescript
function createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User>
```

**Parameters:**
```typescript
{
  id: string,                    // Firebase Auth UID
  email: string,                 // 이메일
  name: string,                  // 이름
  phoneNumber?: string,          // 전화번호 (선택)
  provider: 'google' | 'kakao',  // 로그인 제공자
  photoURL?: string              // 프로필 이미지 (선택)
}
```

**Returns:**
```typescript
{
  ...userData,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**예제:**
```typescript
const user = await createUser({
  id: 'abc123',
  email: 'user@example.com',
  name: '홍길동',
  phoneNumber: '010-1234-5678',
  provider: 'google'
});
```

---

#### getUser()

사용자 조회

**함수 시그니처:**
```typescript
function getUser(userId: string): Promise<User | null>
```

**Parameters:**
- `userId`: Firebase Auth UID

**Returns:**
- 사용자 데이터 또는 `null` (존재하지 않을 경우)

**예제:**
```typescript
const user = await getUser('abc123');
if (user) {
  console.log(user.name);
}
```

---

#### updateUser()

사용자 정보 업데이트

**함수 시그니처:**
```typescript
function updateUser(userId: string, updates: Partial<User>): Promise<void>
```

**Parameters:**
- `userId`: Firebase Auth UID
- `updates`: 업데이트할 필드 (부분 객체)

**예제:**
```typescript
await updateUser('abc123', {
  name: '김철수',
  phoneNumber: '010-9876-5432'
});
```

---

### 주문 관리

#### createOrder()

새 주문 생성

**함수 시그니처:**
```typescript
function createOrder(orderData: Omit<Order, 'createdAt' | 'updatedAt'>): Promise<Order>
```

**Parameters:**
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
  orderId: string                // 주문 번호
}
```

**Returns:**
```typescript
{
  ...orderData,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**예제:**
```typescript
await createOrder({
  id: 'ORDER_123',
  userId: 'abc123',
  userEmail: 'user@example.com',
  userName: '홍길동',
  productId: 'fullstack-web',
  productName: '풀스택 웹 개발 종합반',
  amount: 2400000,
  status: 'completed',
  paymentKey: 'tgen_...',
  orderId: 'ORDER_123'
});
```

---

#### getUserOrders()

사용자별 주문 내역 조회

**함수 시그니처:**
```typescript
function getUserOrders(userId: string): Promise<Order[]>
```

**Parameters:**
- `userId`: 사용자 ID

**Returns:**
- 주문 배열 (최신순 정렬)

**Firestore Query:**
```typescript
const q = query(
  collection(db, 'orders'),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc')
);
```

**필수 인덱스:**
- `userId` (오름차순) + `createdAt` (내림차순)

**예제:**
```typescript
const orders = await getUserOrders('abc123');
console.log(`총 ${orders.length}개의 주문`);
```

---

### 리뷰 관리

#### createReview()

새 리뷰 생성

**함수 시그니처:**
```typescript
function createReview(reviewData: Omit<Review, 'createdAt' | 'updatedAt'>): Promise<Review>
```

**Parameters:**
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
  images: string[]               // 이미지 URL 배열
}
```

**Returns:**
```typescript
{
  ...reviewData,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**예제:**
```typescript
await createReview({
  id: 'review_123',
  productId: 'fullstack-web',
  userId: 'abc123',
  userName: '홍길동',
  userEmail: 'user@example.com',
  rating: 5,
  content: '정말 유익한 강의였습니다!',
  images: [
    'https://storage.googleapis.com/.../image1.jpg',
    'https://storage.googleapis.com/.../image2.jpg'
  ]
});
```

---

#### getProductReviews()

상품별 리뷰 조회

**함수 시그니처:**
```typescript
function getProductReviews(productId: string): Promise<Review[]>
```

**Parameters:**
- `productId`: 상품 ID

**Returns:**
- 리뷰 배열 (최신순 정렬)

**Firestore Query:**
```typescript
const q = query(
  collection(db, 'reviews'),
  where('productId', '==', productId),
  orderBy('createdAt', 'desc')
);
```

**필수 인덱스:**
- `productId` (오름차순) + `createdAt` (내림차순)

**예제:**
```typescript
const reviews = await getProductReviews('fullstack-web');
const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
console.log(`평균 별점: ${avgRating.toFixed(1)}`);
```

---

## Storage Utils

### uploadReviewImage()

리뷰 이미지 업로드 (단일)

**함수 시그니처:**
```typescript
function uploadReviewImage(
  reviewId: string,
  file: File,
  index: number
): Promise<string>
```

**Parameters:**
- `reviewId`: 리뷰 ID
- `file`: 업로드할 이미지 파일
- `index`: 이미지 순서 (0부터 시작)

**Returns:**
- 업로드된 이미지의 공개 URL

**Storage Path:**
```
reviews/{reviewId}_{index}_{timestamp}.{extension}
```

**예제:**
```typescript
const file = imageInput.files[0];
const url = await uploadReviewImage('review_123', file, 0);
console.log('이미지 URL:', url);
```

---

### uploadReviewImages()

리뷰 이미지 업로드 (다중)

**함수 시그니처:**
```typescript
function uploadReviewImages(
  reviewId: string,
  files: File[]
): Promise<string[]>
```

**Parameters:**
- `reviewId`: 리뷰 ID
- `files`: 업로드할 이미지 파일 배열

**Returns:**
- 업로드된 이미지 URL 배열

**예제:**
```typescript
const files = Array.from(imageInput.files);
const urls = await uploadReviewImages('review_123', files);
console.log(`${urls.length}개 이미지 업로드 완료`);
```

---

### uploadProfileImage()

프로필 이미지 업로드

**함수 시그니처:**
```typescript
function uploadProfileImage(
  userId: string,
  file: File
): Promise<string>
```

**Parameters:**
- `userId`: 사용자 ID
- `file`: 업로드할 프로필 이미지

**Returns:**
- 업로드된 이미지의 공개 URL

**Storage Path:**
```
profiles/{userId}_{timestamp}.{extension}
```

**예제:**
```typescript
const file = profileInput.files[0];
const url = await uploadProfileImage('abc123', file);
await updateUser('abc123', { photoURL: url });
```

---

## 인증 함수

### signInWithGoogle()

Google 소셜 로그인

**AuthContext 메서드**

**사용법:**
```typescript
const { signInWithGoogle } = useAuth();

const handleGoogleLogin = async () => {
  try {
    await signInWithGoogle();
    router.push('/');
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};
```

**내부 동작:**
1. Firebase Auth Google 팝업 열기
2. 인증 성공 시 사용자 정보 가져오기
3. Firestore에 사용자 정보 저장 (신규) 또는 업데이트 (기존)

---

### signInWithKakao()

Kakao 소셜 로그인 (OIDC)

**AuthContext 메서드**

**사용법:**
```typescript
const { signInWithKakao } = useAuth();

const handleKakaoLogin = async () => {
  try {
    await signInWithKakao();
    router.push('/');
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};
```

**내부 동작:**
1. Firebase Auth OIDC 팝업 열기 (Kakao 제공업체)
2. 인증 성공 시 사용자 정보 가져오기
3. Firestore에 사용자 정보 저장

**참고:**
- Kakao 로그인 사전 설정 필요 (Firebase Console)
- [KAKAO_LOGIN_FIX.md](../KAKAO_LOGIN_FIX.md) 참조

---

### signOut()

로그아웃

**AuthContext 메서드**

**사용법:**
```typescript
const { signOut } = useAuth();

const handleLogout = async () => {
  await signOut();
  router.push('/login');
};
```

---

## 에러 처리

### Firebase 에러 코드

| 에러 코드 | 설명 | 해결 방법 |
|----------|------|----------|
| `auth/operation-not-allowed` | 로그인 제공업체 비활성화 | Firebase Console에서 활성화 |
| `auth/popup-closed-by-user` | 사용자가 팝업 닫음 | 사용자에게 재시도 요청 |
| `auth/unauthorized-domain` | 도메인 승인 안 됨 | Firebase Console에서 도메인 추가 |
| `storage/unauthorized` | Storage 권한 없음 | Storage 규칙 확인 |
| `storage/unauthenticated` | 로그인 필요 | 로그인 후 재시도 |

### 에러 처리 패턴

```typescript
try {
  await createOrder(orderData);
  console.log('✅ 주문 생성 성공');
} catch (error) {
  if (error instanceof Error) {
    console.error('❌ 주문 생성 실패:', error.message);
    alert('주문 생성 중 오류가 발생했습니다.');
  }
}
```

---

## 로깅 가이드

### 콘솔 로그 규칙

**성공:**
```typescript
console.log('✅ 작업 완료:', data);
```

**진행:**
```typescript
console.log('🔵 작업 시작:', params);
console.log('⏳ 로딩 중...');
```

**에러:**
```typescript
console.error('❌ 작업 실패:', error);
```

**디버그:**
```typescript
console.log('🔍 디버그:', debugData);
```

---

## 성능 최적화

### Firestore 쿼리 최적화

**Bad:**
```typescript
// 전체 데이터 로드 후 클라이언트에서 필터링
const allOrders = await getDocs(collection(db, 'orders'));
const userOrders = allOrders.docs
  .filter(doc => doc.data().userId === userId)
  .map(doc => doc.data());
```

**Good:**
```typescript
// 서버에서 필터링 (인덱스 필요)
const q = query(
  collection(db, 'orders'),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc'),
  limit(10)
);
const snapshot = await getDocs(q);
const orders = snapshot.docs.map(doc => doc.data());
```

### 이미지 업로드 최적화

**병렬 업로드:**
```typescript
// Good: 병렬 실행
const urls = await Promise.all(
  files.map((file, i) => uploadReviewImage(reviewId, file, i))
);

// Bad: 순차 실행
const urls = [];
for (const [i, file] of files.entries()) {
  urls.push(await uploadReviewImage(reviewId, file, i));
}
```

---

## 보안 권장사항

### 1. API Key 보호

```typescript
// ❌ 절대 클라이언트에서 Secret Key 사용 금지
const secretKey = process.env.TOSS_SECRET_KEY; // 서버에서만

// ✅ Public Key는 클라이언트에서 사용 가능
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
```

### 2. 사용자 입력 검증

```typescript
// 리뷰 작성 시
if (content.trim().length < 10) {
  throw new Error('리뷰는 10자 이상 입력해주세요');
}

if (rating < 1 || rating > 5) {
  throw new Error('별점은 1-5점 사이여야 합니다');
}

if (images.length > 4) {
  throw new Error('이미지는 최대 4개까지 업로드 가능합니다');
}
```

### 3. Firestore 보안 규칙

```javascript
// users: 본인만 수정 가능
match /users/{userId} {
  allow write: if request.auth.uid == userId;
}

// orders: 본인만 조회 가능
match /orders/{orderId} {
  allow read: if request.auth.uid == resource.data.userId;
}
```

---

## 테스트 가이드

### 단위 테스트 예제

```typescript
// firestore-utils.test.ts
describe('createUser', () => {
  it('새 사용자를 생성해야 함', async () => {
    const userData = {
      id: 'test123',
      email: 'test@example.com',
      name: '테스트',
      provider: 'google' as const
    };

    const user = await createUser(userData);

    expect(user.id).toBe('test123');
    expect(user.createdAt).toBeDefined();
  });
});
```

### 통합 테스트 시나리오

1. **로그인 → 상품 선택 → 결제 → 주문 확인**
2. **로그인 → 상품 상세 → 리뷰 작성 → 리뷰 확인**
3. **로그인 → 마이페이지 → 프로필 수정 → 저장 확인**

---

## 참고 자료

- [Firebase JavaScript SDK 문서](https://firebase.google.com/docs/reference/js)
- [Toss Payments API 문서](https://docs.tosspayments.com/reference)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
