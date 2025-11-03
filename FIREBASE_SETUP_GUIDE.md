# Firebase 설정 가이드

## 📋 목차
1. [Firestore Database 설정](#1-firestore-database-설정)
2. [Authentication 설정](#2-authentication-설정)
3. [Storage 설정](#3-storage-설정)
4. [보안 규칙 설정](#4-보안-규칙-설정)

---

## 1. Firestore Database 설정

### 1.1 Firestore Database 생성
1. Firebase 콘솔 → 프로젝트 선택 (bsd-test-6de41)
2. **빌드** → **Firestore Database** 클릭
3. **데이터베이스 만들기** 클릭
4. 위치 선택: `asia-northeast3 (Seoul)` 권장
5. **테스트 모드에서 시작** 선택 (나중에 프로덕션 규칙 적용)
6. **사용 설정** 클릭

### 1.2 컬렉션 생성
다음 컬렉션들을 수동으로 생성하거나 코드 실행 시 자동 생성됩니다:

#### `users` 컬렉션
- 문서 ID: uid (Firebase Auth UID)
- 필드:
  ```
  uid: string
  email: string
  name: string
  role: "user" | "admin"
  phoneNumber: string (선택)
  profileImageUrl: string (선택)
  createdAt: timestamp
  updatedAt: timestamp
  ```

#### `orders` 컬렉션
- 문서 ID: orderId (Toss Payments 주문 ID)
- 필드:
  ```
  id: string (orderId와 동일)
  userId: string
  userEmail: string
  userName: string
  productId: string
  productName: string
  amount: number
  status: "pending" | "completed" | "cancelled" | "refunded"
  paymentKey: string
  orderId: string
  createdAt: timestamp
  updatedAt: timestamp
  ```

#### `reviews` 컬렉션
- 문서 ID: 자동 생성
- 필드:
  ```
  id: string (자동 생성)
  userId: string
  userName: string
  userProfileImage: string (선택)
  productId: string
  productName: string
  rating: number (1-5)
  content: string
  images: array of strings (선택)
  createdAt: timestamp
  updatedAt: timestamp
  ```

---

## 2. Authentication 설정

### 2.1 이메일/비밀번호 인증 활성화
1. Firebase 콘솔 → **빌드** → **Authentication** 클릭
2. **시작하기** 클릭
3. **Sign-in method** 탭 선택
4. **이메일/비밀번호** 클릭
5. **사용 설정** 토글 켜기
6. **저장** 클릭

### 2.2 추가 OAuth 설정 (선택사항)
향후 Google/Kakao 로그인을 추가하려면:
- **Google** 제공업체 활성화
- **Kakao** 제공업체는 커스텀 OAuth 설정 필요

---

## 3. Storage 설정

### 3.1 Cloud Storage 시작하기
1. Firebase 콘솔 → **빌드** → **Storage** 클릭
2. **시작하기** 클릭
3. **테스트 모드에서 시작** 선택
4. 위치: `asia-northeast3 (Seoul)` 권장
5. **완료** 클릭

### 3.2 폴더 구조
자동으로 생성되는 폴더:
```
/profiles/{userId}/        # 프로필 이미지
/reviews/{reviewId}/       # 리뷰 이미지
```

---

## 4. 보안 규칙 설정

### 4.1 Firestore 보안 규칙

Firebase 콘솔 → Firestore Database → **규칙** 탭에 다음 규칙 추가:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 헬퍼 함수
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users 컬렉션
    match /users/{userId} {
      // 누구나 읽기 가능 (프로필 정보)
      allow read: if true;

      // 본인 또는 관리자만 생성/수정 가능
      allow create: if isSignedIn();
      allow update: if isOwner(userId) || isAdmin();

      // 본인 또는 관리자만 삭제 가능
      allow delete: if isOwner(userId) || isAdmin();
    }

    // Orders 컬렉션
    match /orders/{orderId} {
      // 본인의 주문 또는 관리자만 읽기 가능
      allow read: if isSignedIn() &&
                     (resource.data.userId == request.auth.uid || isAdmin());

      // 인증된 사용자만 생성 가능
      allow create: if isSignedIn();

      // 본인 또는 관리자만 수정 가능
      allow update: if isSignedIn() &&
                       (resource.data.userId == request.auth.uid || isAdmin());

      // 관리자만 삭제 가능
      allow delete: if isAdmin();
    }

    // Reviews 컬렉션
    match /reviews/{reviewId} {
      // 누구나 읽기 가능 (공개 리뷰)
      allow read: if true;

      // 인증된 사용자만 생성 가능
      allow create: if isSignedIn();

      // 본인 또는 관리자만 수정/삭제 가능
      allow update, delete: if isSignedIn() &&
                               (resource.data.userId == request.auth.uid || isAdmin());
    }

    // Products 컬렉션 (선택사항)
    match /products/{productId} {
      // 누구나 읽기 가능
      allow read: if true;

      // 관리자만 생성/수정/삭제 가능
      allow create, update, delete: if isAdmin();
    }
  }
}
```

**규칙 배포:**
1. 위 규칙을 복사
2. Firebase 콘솔 → Firestore Database → **규칙** 탭
3. 규칙 편집기에 붙여넣기
4. **게시** 클릭

### 4.2 Storage 보안 규칙

Firebase 콘솔 → Storage → **규칙** 탭에 다음 규칙 추가:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // 프로필 이미지
    match /profiles/{userId}/{fileName} {
      // 본인의 프로필만 업로드 가능
      allow read: if true;  // 누구나 볼 수 있음
      allow write: if request.auth != null && request.auth.uid == userId;

      // 파일 크기 제한: 5MB
      allow write: if request.resource.size < 5 * 1024 * 1024;

      // 이미지 파일만 허용
      allow write: if request.resource.contentType.matches('image/.*');
    }

    // 리뷰 이미지
    match /reviews/{reviewId}/{fileName} {
      allow read: if true;  // 누구나 볼 수 있음
      allow write: if request.auth != null;

      // 파일 크기 제한: 5MB
      allow write: if request.resource.size < 5 * 1024 * 1024;

      // 이미지 파일만 허용
      allow write: if request.resource.contentType.matches('image/.*');
    }
  }
}
```

**규칙 배포:**
1. 위 규칙을 복사
2. Firebase 콘솔 → Storage → **규칙** 탭
3. 규칙 편집기에 붙여넣기
4. **게시** 클릭

---

## 5. 첫 관리자 계정 생성

### 5.1 회원가입으로 계정 생성
1. 웹사이트 → 회원가입 페이지
2. 관리자 이메일로 가입 (예: admin@bsdvibecoding.com)
3. 비밀번호 설정 (최소 6자)

### 5.2 Firestore에서 관리자 권한 부여
1. Firebase 콘솔 → Firestore Database
2. `users` 컬렉션에서 방금 생성한 사용자 문서 찾기
3. `role` 필드 값을 `"admin"`으로 변경
4. **업데이트** 클릭

---

## 6. 테스트 체크리스트

### ✅ Firestore
- [ ] Firestore Database 생성 완료
- [ ] 보안 규칙 배포 완료
- [ ] 테스트: 회원가입 후 `users` 컬렉션에 문서 생성 확인

### ✅ Authentication
- [ ] 이메일/비밀번호 인증 활성화
- [ ] 테스트: 회원가입 성공
- [ ] 테스트: 로그인 성공
- [ ] 테스트: 로그아웃 성공

### ✅ Storage
- [ ] Cloud Storage 시작하기 완료
- [ ] 보안 규칙 배포 완료
- [ ] 테스트: 이미지 업로드 (구현 후)

### ✅ 주문/결제
- [ ] 테스트: 결제 완료 후 `orders` 컬렉션에 주문 생성 확인
- [ ] 테스트: 마이페이지에서 주문 내역 조회 확인

### ✅ 리뷰
- [ ] 테스트: 리뷰 작성 후 `reviews` 컬렉션에 문서 생성 확인
- [ ] 테스트: 상품 페이지에서 리뷰 목록 표시 확인

### ✅ 관리자 페이지
- [ ] 관리자 계정 role 설정 완료
- [ ] 테스트: 관리자 로그인 후 전체 사용자 목록 조회
- [ ] 테스트: 관리자 로그인 후 전체 주문 목록 조회

---

## 7. 프로덕션 배포 전 체크리스트

### 보안
- [ ] Firestore 규칙을 테스트 모드에서 프로덕션 규칙으로 변경
- [ ] Storage 규칙을 테스트 모드에서 프로덕션 규칙으로 변경
- [ ] 환경 변수 파일(.env.development)이 .gitignore에 포함되어 있는지 확인
- [ ] Firebase API 키가 Git에 커밋되지 않았는지 확인

### Toss Payments
- [ ] 테스트 API 키를 프로덕션 API 키로 교체
- [ ] 환경 변수 업데이트 (.env.production 생성)

### 기능 테스트
- [ ] 모든 주요 기능 테스트 완료
- [ ] 에러 핸들링 확인
- [ ] 모바일 반응형 확인

---

## 8. 문제 해결

### "권한 거부" 오류
- Firestore/Storage 보안 규칙 확인
- 사용자가 로그인되어 있는지 확인
- 콘솔에서 규칙 시뮬레이터로 테스트

### 데이터가 생성되지 않음
- 네트워크 탭에서 API 요청 확인
- 콘솔 에러 메시지 확인
- Firebase 콘솔에서 실시간 로그 확인

### 로그인 실패
- Authentication이 활성화되어 있는지 확인
- 이메일/비밀번호 제공업체가 활성화되어 있는지 확인
- 사용자가 실제로 등록되어 있는지 확인

---

## 📞 지원

문제가 계속되면:
1. Firebase 콘솔 → 사용량 → 오류 로그 확인
2. 브라우저 개발자 도구 → 콘솔 탭에서 에러 메시지 확인
3. 네트워크 탭에서 실패한 요청 확인
