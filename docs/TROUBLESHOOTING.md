# 문제 해결 가이드

BSD 바이브코딩 플랫폼 개발 및 운영 중 자주 발생하는 문제와 해결 방법

## 목차

1. [Firebase 관련](#firebase-관련)
2. [결제 관련](#결제-관련)
3. [인증 관련](#인증-관련)
4. [리뷰 시스템](#리뷰-시스템)
5. [Next.js 관련](#nextjs-관련)
6. [개발 환경](#개발-환경)

---

## Firebase 관련

### 1. Firestore 인덱스 에러

**문제:**
```
FirebaseError: The query requires an index.
You can create it here: https://console.firebase.google.com/...
```

**원인:**
복합 쿼리 (where + orderBy)를 실행할 때 필요한 인덱스가 없음

**해결 방법:**

1. 에러 메시지의 링크 클릭 → 자동으로 인덱스 생성 화면 이동
2. **인덱스 만들기** 버튼 클릭
3. 3-5분 대기 (상태: 빌드 중 → 사용 설정됨)
4. 페이지 새로고침

**필요한 인덱스:**

- **orders 컬렉션**: `userId` (오름차순) + `createdAt` (내림차순)
- **reviews 컬렉션**: `productId` (오름차순) + `createdAt` (내림차순)

**참고 문서:**
- [FIRESTORE_INDEX_FIX.md](../FIRESTORE_INDEX_FIX.md)
- [REVIEW_INDEX_SETUP.md](../REVIEW_INDEX_SETUP.md)

---

### 2. Storage 권한 에러

**문제:**
```
FirebaseError: storage/unauthorized
```

**원인:**
Firebase Storage 보안 규칙이 설정되지 않았거나 잘못됨

**해결 방법:**

1. Firebase Console → **Storage** → **Rules** 탭
2. 다음 규칙으로 교체:

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

3. **게시** 버튼 클릭

---

### 3. Storage가 활성화되지 않음

**문제:**
Storage 메뉴를 클릭하면 "시작하기" 버튼이 보임

**해결 방법:**

1. **시작하기** 버튼 클릭
2. 위치 선택: `asia-northeast3 (서울)` 권장
3. **완료** 클릭
4. 보안 규칙 설정 (위 2번 참조)

---

### 4. Firestore 오프라인 에러

**문제:**
```
FirebaseError: Failed to get document because the client is offline
```

**원인:**
네트워크 연결 문제 또는 Firestore가 오프라인 모드

**해결 방법:**

1. 인터넷 연결 확인
2. 브라우저 새로고침 (F5)
3. 개발 서버 재시작:
   ```bash
   # Ctrl+C로 중지 후
   npm run dev
   ```

---

## 결제 관련

### 1. 결제 후 주문 데이터가 Firestore에 저장 안 됨

**문제:**
결제는 성공했지만 Firestore `orders` 컬렉션에 데이터가 없음

**원인:**
`userProfile`이 로드되기 전에 결제 승인이 실행됨

**해결 방법:**

이미 수정된 코드 확인:
```typescript
// src/app/payment/success/page.tsx
useEffect(() => {
  if (loading) {
    console.log('⏳ userProfile 로딩 중...');
    return;  // userProfile 로딩 완료될 때까지 대기
  }

  if (!userProfile) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }

  // userProfile 로드 완료 후 결제 승인
  confirmPayment(...);
}, [userProfile, loading, ...]);
```

**확인 사항:**
- 콘솔에 `✅ userProfile 로드 완료, 결제 승인 시작` 로그 확인
- Firestore Console → `orders` 컬렉션에 문서 생성 확인

---

### 2. Toss Payments API 에러

**문제:**
```
Error: 결제 승인 실패: Invalid request
```

**원인:**
- Secret Key가 잘못되었거나 환경 변수에 설정되지 않음
- `amount` 값이 문자열이 아님 (숫자로 전달됨)

**해결 방법:**

1. `.env.local` 파일 확인:
   ```env
   TOSS_SECRET_KEY=test_sk_...
   ```

2. API 호출 시 `amount`를 문자열로 전달:
   ```typescript
   body: JSON.stringify({
     paymentKey,
     orderId,
     amount: amount.toString()  // 문자열 변환 필수
   })
   ```

3. 서버 재시작

---

### 3. 결제 성공 페이지에서 "사용자 정보를 찾을 수 없습니다"

**문제:**
결제 성공 후 알림창 "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요."

**원인:**
- 로그인 세션이 만료됨
- `userProfile` 로딩 실패

**해결 방법:**

1. 로그아웃 후 다시 로그인
2. 콘솔 로그 확인:
   ```
   👤 사용자 프로필 로딩: {id: "...", email: "...", ...}
   ```
3. 로그가 없으면 Firebase Auth 상태 확인

---

## 인증 관련

### 1. Google 로그인이 작동하지 않음

**문제:**
Google 로그인 버튼 클릭 시 팝업이 열리지 않거나 에러 발생

**원인:**
- Firebase Console에서 Google 제공업체가 활성화되지 않음
- 팝업 차단

**해결 방법:**

1. Firebase Console → **Authentication** → **Sign-in method**
2. **Google** 활성화 확인
3. 브라우저 팝업 차단 해제
4. 시크릿 모드에서 테스트

---

### 2. Kakao 로그인 에러

**문제:**
```
FirebaseError: auth/operation-not-allowed
```

**원인:**
Firebase Console에서 Kakao 제공업체 (OIDC)가 설정되지 않음

**해결 방법:**

1. Firebase Console → **Authentication** → **Sign-in method**
2. **새 제공업체 추가** → **OIDC** 선택
3. 다음 정보 입력:
   - 제공업체 ID: `oidc.kakao`
   - 클라이언트 ID: Kakao REST API 키
   - 발급자: `https://kauth.kakao.com`
4. **사용 설정** 활성화
5. **저장**

**상세 가이드:** [KAKAO_LOGIN_FIX.md](../KAKAO_LOGIN_FIX.md)

---

### 3. 로그인 후 사용자 이름이 표시되지 않음

**문제:**
로그인 성공 후 헤더에 "로딩 중..." 만 표시됨

**원인:**
- Firestore에 사용자 데이터가 저장되지 않음
- `userProfile` 상태가 업데이트되지 않음

**해결 방법:**

1. Firestore Console → `users` 컬렉션 확인
2. 로그인한 사용자의 UID로 문서가 존재하는지 확인
3. 콘솔 로그 확인:
   ```
   💾 새 사용자 - Firestore에 프로필 생성 중...
   ✅ 사용자 프로필 저장 완료
   ```
4. 문제 지속 시 로그아웃 → 재로그인

---

## 리뷰 시스템

### 1. 리뷰가 홈페이지에 표시되지 않음

**문제:**
리뷰를 작성했지만 상품 상세 페이지에서 보이지 않음

**원인:**
- Firestore 인덱스가 생성되지 않음
- `getProductReviews` 함수 에러

**해결 방법:**

1. 브라우저 콘솔(F12)에서 에러 확인
2. 인덱스 에러 시 링크 클릭하여 인덱스 생성
3. 3-5분 대기 후 페이지 새로고침
4. 콘솔 로그 확인:
   ```
   ✅ 주문내역 로딩 완료: N건
   ```

---

### 2. 리뷰 이미지가 업로드되지 않음

**문제:**
리뷰 작성 시 텍스트는 저장되지만 이미지가 Firebase Storage에 없음

**원인:**
- Storage 보안 규칙 미설정
- 이미지 크기가 5MB 초과
- 이미지 형식이 지원되지 않음

**해결 방법:**

1. **Storage 규칙 확인** (위의 "Storage 권한 에러" 참조)

2. **이미지 크기 확인:**
   - 각 이미지는 5MB 이하여야 함
   - 최대 4개까지 업로드 가능

3. **지원되는 형식:**
   - JPG, JPEG, PNG, GIF, WEBP

4. **콘솔 로그 확인:**
   ```
   📤 리뷰 이미지 업로드 시작: {...}
   ✅ 이미지 업로드 완료: review_...
   🔗 다운로드 URL 생성: https://...
   ```

5. **에러 확인:**
   ```
   ❌ 리뷰 이미지 업로드 실패: FirebaseError: ...
   ```

---

### 3. 리뷰 통계가 잘못 표시됨

**문제:**
평균 별점이나 별점별 분포가 이상하게 표시됨

**원인:**
- 리뷰 데이터 형식 오류
- 계산 로직 버그

**해결 방법:**

1. Firestore Console에서 `reviews` 컬렉션 확인
2. 각 리뷰의 `rating` 필드가 1-5 사이의 숫자인지 확인
3. 문제 데이터 수정 또는 삭제
4. 페이지 새로고침

---

## Next.js 관련

### 1. Hydration Mismatch 에러

**문제:**
```
Error: A tree hydrated but some attributes of the server rendered HTML
didn't match the client properties.
```

**원인:**
- 브라우저 확장 프로그램이 DOM을 수정 (예: Grammarly, 광고 차단기)
- 서버/클라이언트 렌더링 불일치

**해결 방법:**

1. **무시해도 됨**: 이 에러는 대부분 브라우저 확장 프로그램 때문이며 실제 기능에 영향 없음

2. **확장 프로그램 비활성화:**
   - Chrome 시크릿 모드에서 테스트
   - 확장 프로그램 하나씩 비활성화하여 원인 파악

3. **코드 확인:**
   - `Date.now()`, `Math.random()` 사용 확인
   - 서버/클라이언트에서 다른 값 생성하는지 확인

---

### 2. 개발 서버 느림 (Turbopack)

**문제:**
`npm run dev` 실행 후 페이지 로딩이 느림

**해결 방법:**

1. **캐시 삭제:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Node.js 버전 확인:**
   - Node.js 18 이상 권장
   ```bash
   node -v
   ```

3. **의존성 재설치:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### 3. 이미지 최적화 에러

**문제:**
```
Error: Image optimization using the default loader is not compatible with
`output: 'export'`.
```

**원인:**
`next/image` 사용 시 static export와 호환되지 않음

**해결 방법:**

1. **next.config.js 확인:**
   ```javascript
   module.exports = {
     output: 'standalone',  // 'export' 대신 사용
     images: {
       domains: ['images.unsplash.com', 'firebasestorage.googleapis.com']
     }
   }
   ```

2. **외부 이미지 도메인 추가:**
   - Firebase Storage 도메인
   - Unsplash, 기타 CDN

---

## 개발 환경

### 1. 환경 변수가 작동하지 않음

**문제:**
`process.env.NEXT_PUBLIC_...`가 `undefined`

**원인:**
- `.env.local` 파일이 없거나 잘못된 위치
- 환경 변수 이름 오타
- 서버 재시작 필요

**해결 방법:**

1. **파일 위치 확인:**
   ```
   c:\project\landing\.env.local  ✅
   c:\project\landing\src\.env.local  ❌
   ```

2. **변수 이름 확인:**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...  ✅
   FIREBASE_API_KEY=...              ❌ (클라이언트에서 접근 불가)
   ```

3. **서버 재시작:**
   ```bash
   # Ctrl+C로 중지 후
   npm run dev
   ```

---

### 2. TypeScript 에러

**문제:**
```
Type 'X' is not assignable to type 'Y'
```

**해결 방법:**

1. **타입 확인:**
   ```typescript
   // src/types/firestore.ts 파일 확인
   ```

2. **타입 캐스팅:**
   ```typescript
   const data = snapshot.data() as User;
   ```

3. **any 타입 임시 사용 (권장하지 않음):**
   ```typescript
   const data: any = snapshot.data();
   ```

---

### 3. Git 충돌

**문제:**
```
CONFLICT (content): Merge conflict in src/...
```

**해결 방법:**

1. **현재 변경사항 확인:**
   ```bash
   git status
   ```

2. **충돌 파일 수동 수정:**
   - VS Code에서 충돌 표시 확인
   - 유지할 코드 선택

3. **충돌 해결 후 커밋:**
   ```bash
   git add .
   git commit -m "Resolve merge conflict"
   ```

---

## 디버깅 팁

### 1. 콘솔 로그 활용

```typescript
// 함수 시작
console.log('🔵 함수 시작:', params);

// 중간 확인
console.log('🔍 중간 값:', intermediateValue);

// 성공
console.log('✅ 성공:', result);

// 에러
console.error('❌ 에러:', error);
```

### 2. Network 탭 확인

1. 브라우저 개발자 도구 (F12)
2. **Network** 탭
3. API 호출 확인:
   - Status: 200 (성공), 400/500 (에러)
   - Response: 응답 데이터
   - Payload: 요청 데이터

### 3. React DevTools

1. React DevTools 확장 프로그램 설치
2. Components 탭에서 상태 확인
3. Profiler로 성능 분석

---

## 추가 지원

### 문서
- [README.md](./README.md) - 프로젝트 개요
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 시스템 아키텍처
- [API.md](./API.md) - API 문서

### Firebase 가이드
- [FIRESTORE_INDEX_FIX.md](../FIRESTORE_INDEX_FIX.md)
- [KAKAO_LOGIN_FIX.md](../KAKAO_LOGIN_FIX.md)
- [REVIEW_INDEX_SETUP.md](../REVIEW_INDEX_SETUP.md)

### 커뮤니티
- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Toss Payments 가이드](https://docs.tosspayments.com)
