# 카카오 로그인 교육 자료 📚

## 📂 문서 구조

```
docs/
└── KAKAO_LOGIN_GUIDE.md       # 📖 상세한 단계별 가이드 (메인 문서)

src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── kakao/
│   │           └── callback/
│   │               └── route.ts    # 🔧 서버 API (상세 주석 포함)
│   └── auth/
│       └── kakao/
│           └── success/
│               └── page.tsx        # 🎨 클라이언트 페이지 (상세 주석 포함)
└── lib/
    └── firebase.ts                 # ⚙️ Firebase 초기화
```

---

## 🎯 학습 순서

### 1단계: 개념 이해 (1-2시간)
📖 **문서**: `KAKAO_LOGIN_GUIDE.md` 읽기

**학습 내용**:
- OAuth 2.0 인증 흐름
- Firebase Admin SDK vs Client SDK
- Custom Token 방식
- Firestore 데이터 모델링

**체크포인트**:
- [ ] Authorization Code와 Access Token의 차이를 설명할 수 있는가?
- [ ] Admin SDK와 Client SDK를 언제 사용하는지 아는가?
- [ ] Custom Token이 왜 필요한지 이해하는가?

---

### 2단계: 환경 설정 (30분-1시간)
📝 **문서**: `KAKAO_LOGIN_GUIDE.md` > [사전 준비](#사전-준비)

**설정 항목**:
1. ✅ 카카오 개발자 계정 생성
2. ✅ 카카오 앱 등록 및 키 발급
3. ✅ Firebase 프로젝트 생성
4. ✅ Firebase Admin SDK 서비스 계정 생성
5. ✅ 환경 변수 설정 (`.env.development`)

**완료 확인**:
```bash
# 환경 변수 확인
cat .env.development

# 필수 항목 확인:
# - NEXT_PUBLIC_KAKAO_JS_KEY
# - FIREBASE_CLIENT_EMAIL
# - FIREBASE_PRIVATE_KEY
```

---

### 3단계: 코드 이해 (2-3시간)
💻 **파일**:
- `src/app/api/auth/kakao/callback/route.ts`
- `src/app/auth/kakao/success/page.tsx`

**학습 방법**:
1. **주석을 따라 읽기**: 각 섹션의 주석을 순서대로 읽으며 이해
2. **코드 실행 흐름 추적**: 디버거로 단계별 실행 확인
3. **콘솔 로그 확인**: 브라우저 개발자 도구와 터미널 로그 비교

**핵심 함수 이해**:
```typescript
// 1. 서버 측 (callback/route.ts)
admin.auth().createUser()          // Firebase Auth 사용자 생성
adminDb.collection('users').set()  // Firestore 데이터 저장
admin.auth().createCustomToken()   // Custom Token 발급

// 2. 클라이언트 측 (success/page.tsx)
signInWithCustomToken(auth, token) // Custom Token으로 로그인
```

**체크포인트**:
- [ ] 각 STEP의 역할을 설명할 수 있는가?
- [ ] Admin SDK를 왜 서버에서만 사용하는지 아는가?
- [ ] Custom Token이 어떻게 전달되는지 아는가?

---

### 4단계: 실습 (1-2시간)
🧪 **작업**: 직접 로그인 기능 테스트

**실습 순서**:
1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **브라우저 테스트**
   - http://localhost:3000/login 접속
   - 카카오 로그인 버튼 클릭
   - 로그인 과정 관찰

3. **콘솔 로그 확인**
   - 터미널: 서버 측 로그
   - 브라우저 F12: 클라이언트 측 로그

4. **Firebase Console 확인**
   - Authentication: 사용자 생성 확인
   - Firestore: users 컬렉션 데이터 확인

**예상 로그 순서**:
```
서버 (터미널):
✅ 카카오 인증 코드 수신: abc123...
✅ 액세스 토큰 발급 완료
📥 카카오 사용자 정보: {...}
💾 새 Firebase Auth 사용자 생성: kakao_123
💾 Firestore에 사용자 정보 저장: kakao_123
✅ Custom Token 발급 완료

클라이언트 (브라우저):
🔥 Firebase Custom Token으로 로그인 시작
✅ Firebase 로그인 성공: kakao_123
```

**체크포인트**:
- [ ] 로그인이 정상적으로 작동하는가?
- [ ] Firebase Console에 데이터가 저장되는가?
- [ ] 새로고침 후에도 로그인 상태가 유지되는가?

---

### 5단계: 디버깅 실습 (1시간)
🐛 **작업**: 의도적으로 에러 발생시켜 해결하기

**연습 시나리오**:

1. **시나리오 1: 환경 변수 오류**
   ```bash
   # .env.development에서 KAKAO_JS_KEY 주석 처리
   # NEXT_PUBLIC_KAKAO_JS_KEY=...

   # 예상 에러: 토큰 발급 실패
   # 해결: 환경 변수 복구 및 서버 재시작
   ```

2. **시나리오 2: Redirect URI 불일치**
   ```
   카카오 개발자 콘솔에서 Redirect URI 잘못 설정

   예상 에러: redirect_uri mismatch
   해결: 올바른 URI 등록
   ```

3. **시나리오 3: Firebase Private Key 오류**
   ```bash
   # FIREBASE_PRIVATE_KEY 따옴표 제거

   예상 에러: Firebase Admin SDK 초기화 실패
   해결: 따옴표로 감싸기
   ```

**체크포인트**:
- [ ] 각 에러의 원인을 파악할 수 있는가?
- [ ] 에러 메시지를 보고 해결책을 찾을 수 있는가?

---

### 6단계: 심화 학습 (선택, 2-3시간)
🚀 **작업**: 기능 확장 및 개선

**심화 주제**:

1. **로그아웃 구현**
   ```typescript
   // src/app/api/auth/logout/route.ts
   await signOut(auth)
   ```

2. **프로필 수정**
   ```typescript
   // Firestore 사용자 정보 업데이트
   await updateDoc(doc(db, 'users', uid), { name: newName })
   ```

3. **역할 기반 권한 (RBAC)**
   ```typescript
   // Firestore 보안 규칙 활용
   allow read: if request.auth.uid == userId
   allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
   ```

4. **다른 소셜 로그인 추가**
   - Google 로그인
   - Naver 로그인
   - 같은 패턴 적용

---

## 🔑 핵심 개념 요약

### OAuth 2.0 흐름
```
사용자 → 카카오 로그인
      → Authorization Code 발급
        → 서버: Code → Access Token 교환
          → 서버: Access Token → 사용자 정보 조회
            → 서버: Firebase 연동
              → 서버: Custom Token 발급
                → 클라이언트: Custom Token → Firebase 로그인
                  → 완료!
```

### Admin SDK vs Client SDK
| 구분 | Admin SDK | Client SDK |
|------|-----------|------------|
| 실행 환경 | 서버 | 브라우저 |
| 권한 | 모든 권한 | 제한된 권한 |
| 보안 키 | Private Key 필요 | API Key 사용 |
| Firestore | 보안 규칙 무시 | 보안 규칙 적용 |
| 사용 예 | Custom Token 발급 | 로그인 상태 관리 |

### Custom Token 방식
```typescript
// 서버 (Admin SDK)
const customToken = await admin.auth().createCustomToken(uid)
// → 클라이언트로 전달

// 클라이언트 (Client SDK)
await signInWithCustomToken(auth, customToken)
// → Firebase 로그인 완료
```

---

## 📊 평가 체크리스트

### 기본 (필수)
- [ ] OAuth 2.0 흐름을 설명할 수 있다
- [ ] Authorization Code와 Access Token의 차이를 안다
- [ ] Admin SDK와 Client SDK의 차이를 안다
- [ ] Custom Token의 역할을 이해한다
- [ ] 카카오 로그인을 성공적으로 구현했다
- [ ] Firebase에 데이터가 저장되는 것을 확인했다

### 중급 (권장)
- [ ] 각 STEP의 코드를 수정 없이 설명할 수 있다
- [ ] 에러 발생 시 원인을 파악하고 해결할 수 있다
- [ ] Firestore 보안 규칙을 이해한다
- [ ] 환경 변수 관리의 중요성을 안다

### 고급 (선택)
- [ ] 로그아웃 기능을 직접 구현할 수 있다
- [ ] 다른 소셜 로그인을 추가할 수 있다
- [ ] Firebase Security Rules를 작성할 수 있다
- [ ] Custom Token 방식의 보안상 장점을 설명할 수 있다

---

## 🆘 자주 묻는 질문 (FAQ)

### Q1. Admin SDK와 Client SDK를 언제 사용하나요?
**A**:
- **서버 (API Routes)**: Admin SDK 사용
  - Private Key 보호 가능
  - 모든 권한 필요
  - 예: Custom Token 발급, Firestore 직접 쓰기

- **클라이언트 (브라우저)**: Client SDK 사용
  - API Key 공개 가능
  - 보안 규칙으로 제한
  - 예: 로그인 상태 관리, 사용자 데이터 읽기

### Q2. Custom Token이 왜 필요한가요?
**A**:
1. **보안**: 카카오 Access Token이 클라이언트에 노출되지 않음
2. **제어**: 서버에서 검증 후 토큰 발급 (악의적 접근 차단)
3. **간편함**: 클라이언트는 토큰만 받아서 로그인

### Q3. Firestore에 데이터가 안 들어갑니다
**A**:
1. **Admin SDK 사용 확인**: 서버에서는 `admin.firestore()` 사용
2. **환경 변수 확인**: `FIREBASE_PRIVATE_KEY`가 올바른지 확인
3. **서버 재시작**: 환경 변수 변경 후 반드시 재시작

### Q4. 로그인 후 다시 로그인 화면으로 돌아갑니다
**A**:
1. **콘솔 로그 확인**: 어느 단계에서 실패하는지 확인
2. **Firebase Console**: Authentication에 사용자가 생성되었는지 확인
3. **토큰 확인**: Custom Token이 제대로 전달되는지 확인

---

## 📚 추가 학습 자료

### 공식 문서
- [카카오 로그인 REST API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Custom Token](https://firebase.google.com/docs/auth/admin/create-custom-tokens)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### 참고 개념
- OAuth 2.0 Authorization Code Flow
- JWT (JSON Web Token)
- Firebase Security Rules
- Next.js Server vs Client Components

---

## 💡 다음 단계

교육 완료 후:

1. **프로젝트에 적용**: 실제 프로젝트에 카카오 로그인 구현
2. **다른 소셜 로그인**: Google, Naver 등 추가
3. **보안 강화**: Firestore Security Rules 심화 학습
4. **성능 최적화**: Caching, Session 관리 개선
5. **모니터링**: Firebase Analytics, Error Logging 설정

---

**교육 목표 달성 기준**:
- ✅ 카카오 로그인을 독립적으로 구현할 수 있음
- ✅ 각 단계의 코드를 이해하고 설명할 수 있음
- ✅ 에러 발생 시 스스로 해결할 수 있음
- ✅ 다른 팀원에게 가르칠 수 있음

**예상 학습 시간**: 총 8-12시간
- 개념 이해: 2시간
- 환경 설정: 1시간
- 코드 이해: 3시간
- 실습 및 디버깅: 2시간
- 심화 학습: 2-4시간 (선택)

행운을 빕니다! 🚀
