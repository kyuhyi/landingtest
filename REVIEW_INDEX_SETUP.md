# 🔥 리뷰 시스템 Firestore 인덱스 설정 가이드

## 문제 상황

리뷰 작성 기능은 구현되었지만, 상품별 리뷰 목록을 불러올 때 다음과 같은 에러가 발생할 수 있습니다:

```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/...
```

이 에러는 **Firestore에서 복합 쿼리(productId + createdAt)를 실행할 때 필요한 인덱스가 없기 때문**입니다.

---

## 🚀 빠른 해결 방법

### 방법 1: 에러 메시지의 링크 클릭 (가장 쉬움)

1. 브라우저 개발자 도구 콘솔을 엽니다 (F12)
2. 에러 메시지에서 **긴 URL 링크**를 찾습니다
   ```
   https://console.firebase.google.com/v1/r/project/bsd-test-6de41/firestore/indexes?create_composite=...
   ```
3. 링크를 **Ctrl+클릭** 또는 복사해서 새 탭에서 엽니다
4. Firebase Console이 자동으로 열리면서 **인덱스 생성 화면**이 표시됩니다
5. **인덱스 만들기** 버튼 클릭
6. 인덱스 생성 완료까지 **3-5분** 대기

### 방법 2: 수동 인덱스 생성

Firebase Console에서 직접 인덱스를 생성할 수 있습니다.

1. **Firebase Console 접속**:
   ```
   https://console.firebase.google.com
   → 프로젝트: bsd-test-6de41 선택
   ```

2. **Firestore Database** 클릭

3. 상단 탭에서 **인덱스** 클릭

4. **복합 인덱스** 탭 선택

5. **인덱스 추가** 버튼 클릭

---

## 📋 필요한 인덱스 목록

### 1. reviews 컬렉션 인덱스 (상품별 리뷰 조회)

상품 상세 페이지에서 해당 상품의 리뷰를 최신순으로 조회할 때 필요합니다.

```yaml
컬렉션 ID: reviews
필드:
  - productId (오름차순)
  - createdAt (내림차순)
쿼리 범위: 컬렉션
```

#### 수동 생성 방법:
1. **컬렉션 ID**: `reviews` 입력
2. **필드 추가** 클릭
   - **필드 경로**: `productId`
   - **정렬 방향**: `오름차순` (Ascending)
3. **필드 추가** 클릭
   - **필드 경로**: `createdAt`
   - **정렬 방향**: `내림차순` (Descending)
4. **쿼리 범위**: `컬렉션` 선택
5. **만들기** 버튼 클릭

### 2. reviews 컬렉션 인덱스 (사용자별 리뷰 조회 - 선택사항)

마이페이지에서 사용자가 작성한 리뷰를 조회할 때 필요합니다 (향후 기능).

```yaml
컬렉션 ID: reviews
필드:
  - userId (오름차순)
  - createdAt (내림차순)
쿼리 범위: 컬렉션
```

---

## ⏱️ 인덱스 생성 시간

- **생성 시작**: 즉시
- **완료 시간**: 보통 **3-5분**
- **대용량 데이터**: 리뷰 데이터가 많으면 더 오래 걸릴 수 있음

### 진행 상태 확인

1. Firebase Console → Firestore Database → 인덱스
2. 복합 인덱스 탭에서 상태 확인:
   - 🟡 **빌드 중**: 인덱스 생성 중
   - 🟢 **사용 설정됨**: 인덱스 사용 가능
   - 🔴 **오류**: 인덱스 생성 실패

---

## 🔍 쿼리별 필요 인덱스

### 리뷰 시스템에서 사용되는 쿼리

| 쿼리 위치 | 컬렉션 | 필드 | 목적 |
|----------|--------|------|------|
| [ProductReviews.tsx:19](c:\project\landing\src\components\ProductReviews.tsx#L19) | reviews | productId, createdAt | 상품별 최신 리뷰 목록 |
| 마이페이지 (향후) | reviews | userId, createdAt | 사용자별 작성 리뷰 목록 |

### Firestore Utils 함수

[src/lib/firestore-utils.ts](c:\project\landing\src\lib\firestore-utils.ts)의 `getProductReviews` 함수:
```typescript
export async function getProductReviews(productId: string): Promise<Review[]> {
  const reviewsRef = collection(db, COLLECTIONS.REVIEWS)
  const q = query(
    reviewsRef,
    where('productId', '==', productId),
    orderBy('createdAt', 'desc')  // 이 orderBy 때문에 인덱스 필요
  )
  // ...
}
```

---

## ✅ 인덱스 생성 완료 확인

### 테스트 절차

1. 인덱스 상태가 **사용 설정됨**으로 변경될 때까지 대기

2. 개발 서버 새로고침 또는 재시작:
   ```bash
   # Ctrl+C로 서버 중지 후
   npm run dev
   ```

3. 상품 상세 페이지 접속:
   ```
   http://localhost:3000/products/fullstack-web
   ```

4. 페이지 하단 **수강생 리뷰** 섹션 확인

5. **리뷰 작성** 버튼 클릭하여 테스트 리뷰 작성

6. 리뷰가 정상적으로 표시되는지 확인

### 콘솔 로그 확인

인덱스가 정상 작동하면 다음과 같은 로그가 출력됩니다:
```
✍️ 리뷰 작성 시작: {productId: "fullstack-web", rating: 5, ...}
📤 다중 이미지 업로드 시작: {reviewId: "review_...", count: 2}
✅ 모든 이미지 업로드 완료: 2
💾 Firestore에 리뷰 저장 중...
✅ 리뷰 작성 완료!
```

에러가 없어야 합니다.

---

## 🐛 문제 해결

### 에러: "The query requires an index"
**원인**: 인덱스가 생성되지 않았거나 아직 빌드 중
**해결**:
1. Firebase Console에서 인덱스 상태 확인
2. "빌드 중"이면 3-5분 대기
3. "사용 설정됨"이 되면 페이지 새로고침

### 에러: 인덱스 생성 실패
**원인**: Firebase 계정 권한 문제 또는 프로젝트 할당량 초과
**해결**:
1. Firebase Console에서 프로젝트 소유자 권한 확인
2. Firestore 할당량 확인
3. 필요시 Firebase 지원팀 문의

### 리뷰가 표시되지 않음
**원인**: 아직 작성된 리뷰가 없음
**해결**:
1. 로그인 후 상품 상세 페이지 접속
2. **리뷰 작성** 버튼으로 테스트 리뷰 작성
3. 리뷰 작성 후 Firestore Database → `reviews` 컬렉션 확인
4. 데이터가 있는데도 표시되지 않으면 콘솔 에러 확인

### 이미지 업로드 실패
**원인**: Firebase Storage 권한 설정 문제
**해결**:
1. Firebase Console → Storage 섹션 접속
2. Rules 탭에서 다음 규칙 확인:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /reviews/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
3. 저장 후 테스트

---

## 📊 Firebase Storage 규칙 설정

리뷰 이미지 업로드를 위해 Storage 규칙도 설정해야 합니다.

### Storage 규칙 확인 및 설정

1. Firebase Console → Storage 클릭
2. **Rules** 탭 선택
3. 다음 규칙 추가:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 리뷰 이미지: 로그인한 사용자만 업로드, 모두 읽기 가능
    match /reviews/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024  // 5MB 제한
                   && request.resource.contentType.matches('image/.*');  // 이미지만 허용
    }

    // 프로필 이미지: 본인만 업로드, 모두 읽기 가능
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

4. **게시** 버튼 클릭

---

## 🎯 체크리스트

### Firestore 인덱스 설정
- [ ] `reviews` 컬렉션 인덱스 (productId + createdAt) 생성
- [ ] 인덱스 상태 "사용 설정됨" 확인
- [ ] 개발 서버 재시작

### Firebase Storage 설정
- [ ] Storage 규칙 설정 확인
- [ ] 리뷰 이미지 업로드 경로 권한 확인
- [ ] 이미지 크기 제한 (5MB) 설정 확인

### 기능 테스트
- [ ] 상품 상세 페이지 접속 시 에러 없음
- [ ] 리뷰 작성 버튼 표시 (로그인 상태)
- [ ] 리뷰 작성 모달 정상 동작
- [ ] 이미지 업로드 (최대 4장) 정상 동작
- [ ] 리뷰 등록 후 목록에 즉시 표시
- [ ] 콘솔에 Firestore/Storage 에러 없음

---

## 📚 참고 문서

- [Firestore 인덱스 관리](https://firebase.google.com/docs/firestore/query-data/indexing)
- [복합 인덱스 생성](https://firebase.google.com/docs/firestore/query-data/index-overview#composite_indexes)
- [Firebase Storage 보안 규칙](https://firebase.google.com/docs/storage/security)
- [이미지 업로드 가이드](https://firebase.google.com/docs/storage/web/upload-files)

---

## ✅ 완료!

인덱스 생성과 Storage 규칙 설정이 완료되면 리뷰 시스템이 정상 작동합니다! 🎉

### 리뷰 작성 테스트

1. 로그인 (구글 또는 카카오)
2. 상품 상세 페이지 접속
3. **리뷰 작성** 버튼 클릭
4. 별점, 내용, 이미지 입력
5. **리뷰 등록** 버튼 클릭
6. 리뷰가 목록에 즉시 표시되는지 확인

### 다음 단계

리뷰 시스템이 완료되었으니, 다음 기능들을 추가할 수 있습니다:

- 리뷰 수정/삭제 기능
- 리뷰 좋아요/싫어요 기능
- 리뷰 신고 기능
- 강사 답글 기능
- 리뷰 필터링 (별점별, 최신순/인기순)
