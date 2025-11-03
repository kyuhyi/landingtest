# 🔐 OAuth 소셜 로그인 설정 가이드

## ✅ 구현 완료 사항

### 1. **코드 구현 완료**
   - Google OAuth 로그인/회원가입 기능
   - Kakao OAuth 로그인/회원가입 기능
   - 자동 Firestore 사용자 프로필 생성
   - 에러 처리 및 로딩 상태 관리

### 2. **적용 페이지**
   - `/signup` - 회원가입 페이지
   - `/login` - 로그인 페이지

---

## 🔧 Firebase Console 설정 필요

OAuth 기능을 사용하려면 Firebase Console에서 추가 설정이 필요합니다.

---

## 📱 Google OAuth 설정

### 1. Firebase Console 열기
```
https://console.firebase.google.com
→ 프로젝트: bsd-test-6de41 선택
```

### 2. Authentication 설정
1. 왼쪽 메뉴에서 **Authentication** 클릭
2. **Sign-in method** 탭 클릭
3. **Google** 찾기
4. **Google** 클릭하여 설정 열기
5. **사용 설정** 토글을 **ON**으로 변경
6. **프로젝트의 공개용 이름**: `BSD 바이브코딩` 입력
7. **프로젝트 지원 이메일**: 본인 이메일 선택
8. **저장** 클릭

### 3. 승인된 도메인 확인
Authentication → Settings → Authorized domains에서:
- `localhost` (개발용 - 이미 있음)
- 배포 도메인 (예: `yourdomain.com`) 추가 필요 시

**중요**: `localhost`는 기본적으로 승인되어 있어서 로컬 개발 시 바로 사용 가능합니다.

---

## 🟡 Kakao OAuth 설정

Kakao OAuth는 Google보다 설정이 복잡합니다.

### 1. Kakao Developers 계정 생성

```
https://developers.kakao.com
→ 카카오 계정으로 로그인
```

### 2. 애플리케이션 등록

1. **내 애플리케이션** 클릭
2. **애플리케이션 추가하기** 클릭
3. 애플리케이션 정보 입력:
   - **앱 이름**: `BSD 바이브코딩`
   - **사업자명**: 본인 또는 회사명
   - **카테고리**: `교육` 선택
4. **저장** 클릭

### 3. REST API 키 복사

애플리케이션 설정 페이지에서:
- **앱 키** 탭
- **REST API 키** 복사 (나중에 사용)

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
2. **카카오 로그인 활성화**: **ON**으로 변경
3. **Redirect URI 등록** 클릭
4. 다음 URI 추가:
   ```
   https://bsd-test-6de41.firebaseapp.com/__/auth/handler
   ```
   *(Firebase 프로젝트 ID가 `bsd-test-6de41`인 경우)*

### 6. 동의 항목 설정

1. **제품 설정** → **카카오 로그인** → **동의 항목** 클릭
2. 다음 항목을 **필수 동의**로 설정:
   - **닉네임**
   - **프로필 이미지**
   - **카카오계정(이메일)**

### 7. Firebase Console에서 Kakao 설정

1. Firebase Console 열기
   ```
   https://console.firebase.google.com
   → 프로젝트: bsd-test-6de41 선택
   ```

2. **Authentication** → **Sign-in method** 탭

3. **새 제공업체 추가** 클릭

4. **SAML** 선택

5. 다음 정보 입력:
   - **제공업체 이름**: `Kakao`
   - **제공업체 ID**: `oidc.kakao`
   - **클라이언트 ID**: Kakao에서 복사한 REST API 키
   - **발급자(issuer)**: `https://kauth.kakao.com`

6. **사용 설정** 활성화

7. **저장** 클릭

---

## 🧪 테스트 방법

### Google 로그인 테스트

1. **회원가입 페이지 접속**
   ```
   http://localhost:3000/signup
   ```

2. **이용약관 체크박스 선택**

3. **Google로 시작하기 버튼** 클릭

4. **Google 계정 선택**
   - 브라우저 팝업에서 Google 계정 선택
   - 권한 승인

5. **자동 리다이렉트**
   - 성공 시 홈페이지(`/`)로 자동 이동
   - 우측 상단에 사용자 이름 표시

6. **Firestore 확인**
   - Firebase Console → Firestore Database
   - `users` 컬렉션에 사용자 문서 생성 확인
   - 필드: `uid`, `email`, `name`, `role`, `profileImageUrl`, `createdAt`, `updatedAt`

### Kakao 로그인 테스트

1. **로그인 페이지 접속**
   ```
   http://localhost:3000/login
   ```

2. **카카오로 계속하기 버튼** 클릭

3. **카카오 계정 로그인**
   - 카카오 로그인 팝업
   - 카카오 계정 입력
   - 동의 항목 확인

4. **자동 리다이렉트**
   - 성공 시 홈페이지로 이동
   - 사용자 정보 표시

---

## 📊 콘솔 로그 확인

### Google 로그인 성공 시 로그:
```
🔥 Google 소셜 로그인 시작
📝 Google 팝업 열기...
✅ Google 로그인 성공: [UID]
💾 새 사용자 - Firestore에 프로필 생성 중...
🔵 createUser 호출됨: {...}
✅ createUser 성공
✅ Google 사용자 프로필 저장 완료
```

### Kakao 로그인 성공 시 로그:
```
🔥 Kakao 소셜 로그인 시작
📝 Kakao 팝업 열기...
✅ Kakao 로그인 성공: [UID]
✅ 기존 사용자 로그인 완료
```

---

## ⚠️ 주의사항

### 1. **팝업 차단 해제**
브라우저에서 팝업 차단이 활성화되어 있으면 OAuth 로그인이 작동하지 않습니다.
- Chrome: 주소창 우측 팝업 차단 아이콘 클릭 → 허용

### 2. **이용약관 동의 필수 (회원가입만)**
회원가입 페이지에서는 이용약관 동의를 먼저 체크해야 합니다.
로그인 페이지는 이용약관 체크 불필요.

### 3. **프로필 정보 자동 생성**
OAuth 로그인 시 다음 정보가 자동으로 저장됩니다:
- **이메일**: Google/Kakao 계정 이메일
- **이름**: Google/Kakao 프로필 이름 (없으면 이메일 앞부분 사용)
- **프로필 이미지**: Google/Kakao 프로필 사진 (있는 경우)
- **역할**: `user` (기본값)

### 4. **기존 사용자 처리**
이미 가입된 사용자가 OAuth 로그인하면:
- 새로운 프로필 생성하지 않음
- 기존 프로필 정보 유지
- 바로 로그인 처리

---

## 🐛 문제 해결

### 에러: "auth/popup-closed-by-user"
**원인**: 사용자가 팝업을 닫음
**해결**: 다시 버튼 클릭

### 에러: "auth/cancelled-popup-request"
**원인**: 이전 팝업 요청이 취소됨
**해결**: 페이지 새로고침 후 다시 시도

### 에러: "auth/unauthorized-domain"
**원인**: Firebase에 도메인이 승인되지 않음
**해결**:
1. Firebase Console → Authentication → Settings
2. Authorized domains에 도메인 추가

### Kakao 로그인 안됨
**확인 사항**:
1. Kakao Developers에서 앱 등록 완료 확인
2. Redirect URI가 정확한지 확인
3. 동의 항목 설정 확인
4. Firebase에서 `oidc.kakao` 제공업체 활성화 확인

---

## 📝 배포 시 추가 설정

### 1. Authorized Domains 추가
Firebase Console → Authentication → Settings → Authorized domains:
```
yourdomain.com
www.yourdomain.com
```

### 2. Kakao Redirect URI 추가
Kakao Developers → 제품 설정 → Redirect URI:
```
https://yourdomain.com
https://bsd-test-6de41.firebaseapp.com/__/auth/handler
```

### 3. Web 플랫폼 도메인 추가
Kakao Developers → 플랫폼 → Web:
```
https://yourdomain.com
```

---

## ✅ 체크리스트

### Google OAuth
- [ ] Firebase Authentication에서 Google 제공업체 활성화
- [ ] 로컬에서 Google 로그인 테스트 성공
- [ ] Firestore에 사용자 문서 생성 확인
- [ ] 재로그인 시 기존 프로필 유지 확인

### Kakao OAuth
- [ ] Kakao Developers 앱 등록
- [ ] REST API 키 확보
- [ ] Redirect URI 설정
- [ ] 동의 항목 설정 (이메일, 닉네임, 프로필)
- [ ] Firebase에서 `oidc.kakao` 제공업체 추가
- [ ] 로컬에서 Kakao 로그인 테스트 성공

---

## 📚 참고 문서

- [Firebase Authentication - Google](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase Authentication - Custom OAuth](https://firebase.google.com/docs/auth/web/custom-auth)
- [Kakao Developers - 카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Kakao Developers - REST API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)

---

## 🎉 완료!

모든 설정이 완료되면:
- ✅ Google 로그인으로 간편 회원가입/로그인
- ✅ Kakao 로그인으로 간편 회원가입/로그인
- ✅ 이메일/비밀번호 로그인 (기존 방식)

세 가지 로그인 방법 모두 사용 가능합니다! 🚀
