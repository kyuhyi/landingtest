# 🟡 카카오 로그인 설정 가이드

## 문제 상황
```
Firebase: Error (auth/operation-not-allowed)
```

이 에러는 **Firebase Console에서 Kakao 로그인 제공업체가 활성화되지 않았기 때문**입니다.

---

## 해결 방법

### 1단계: Firebase Console 접속

```
https://console.firebase.google.com
→ 프로젝트: bsd-test-6de41 선택
```

### 2단계: Authentication 설정

1. 왼쪽 메뉴에서 **Authentication** 클릭
2. 상단 탭에서 **Sign-in method** 클릭
3. **새 제공업체 추가** 버튼 클릭

### 3단계: OIDC 제공업체 추가

1. **OIDC** (OpenID Connect) 선택
2. 다음 정보 입력:

```yaml
제공업체 이름: Kakao
제공업체 ID: oidc.kakao
클라이언트 ID: (Kakao REST API 키 입력 필요)
발급자(Issuer): https://kauth.kakao.com
```

3. **사용 설정** 토글을 **ON**으로 변경
4. **저장** 클릭

---

## 💡 중요: Kakao REST API 키 발급 방법

### 1. Kakao Developers 계정 생성
```
https://developers.kakao.com
→ 카카오 계정으로 로그인
```

### 2. 애플리케이션 등록

1. **내 애플리케이션** 클릭
2. **애플리케이션 추가하기** 클릭
3. 앱 정보 입력:
   - **앱 이름**: `BSD 바이브코딩`
   - **사업자명**: 본인 또는 회사명
   - **카테고리**: `교육` 선택
4. **저장** 클릭

### 3. REST API 키 복사

1. 애플리케이션 설정 페이지 → **앱 키** 탭
2. **REST API 키** 복사
3. 이 키를 Firebase Console의 **클라이언트 ID** 필드에 붙여넣기

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

### 6. 동의 항목 설정

1. **제품 설정** → **카카오 로그인** → **동의 항목** 클릭
2. 다음 항목을 **필수 동의**로 설정:
   - ✅ **닉네임**
   - ✅ **프로필 이미지**
   - ✅ **카카오계정(이메일)**

---

## ✅ 설정 완료 확인

### 테스트 절차

1. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

2. 로그인 페이지 접속:
   ```
   http://localhost:3000/login
   ```

3. **카카오로 계속하기** 버튼 클릭

4. 카카오 로그인 팝업에서 계정 입력

5. 동의 항목 확인 후 **동의하고 계속하기**

6. 성공 시 홈페이지(`/`)로 자동 리다이렉트

7. 우측 상단에 사용자 이름 표시 확인

### 콘솔 로그 확인

성공 시 다음과 같은 로그가 출력됩니다:
```
🔥 Kakao 소셜 로그인 시작
📝 Kakao 팝업 열기...
✅ Kakao 로그인 성공: [사용자 UID]
💾 새 사용자 - Firestore에 프로필 생성 중...
✅ Kakao 사용자 프로필 저장 완료
```

---

## 🐛 문제 해결

### 에러: "auth/operation-not-allowed"
**원인**: Firebase Console에서 Kakao 제공업체가 활성화되지 않음
**해결**: 위의 "2단계: Authentication 설정" 단계를 완료하세요

### 에러: "auth/invalid-credential"
**원인**: Kakao REST API 키가 잘못되었거나 입력되지 않음
**해결**: Kakao Developers에서 REST API 키를 다시 확인하고 Firebase Console에 정확히 입력하세요

### 에러: "auth/popup-closed-by-user"
**원인**: 사용자가 카카오 로그인 팝업을 닫음
**해결**: 다시 로그인 버튼을 클릭하세요

### 에러: "auth/unauthorized-domain"
**원인**: Firebase에 도메인이 승인되지 않음
**해결**:
1. Firebase Console → Authentication → Settings
2. Authorized domains에 도메인 추가:
   ```
   localhost
   ```

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

## 🎯 체크리스트

### Kakao Developers 설정
- [ ] Kakao 애플리케이션 등록
- [ ] REST API 키 발급
- [ ] Web 플랫폼 등록 (`http://localhost:3000`)
- [ ] Redirect URI 설정 (`https://bsd-test-6de41.firebaseapp.com/__/auth/handler`)
- [ ] 카카오 로그인 활성화
- [ ] 동의 항목 설정 (이메일, 닉네임, 프로필)

### Firebase Console 설정
- [ ] Authentication → Sign-in method 접속
- [ ] 새 제공업체 추가 → OIDC 선택
- [ ] 제공업체 ID: `oidc.kakao` 입력
- [ ] 클라이언트 ID: Kakao REST API 키 입력
- [ ] 발급자: `https://kauth.kakao.com` 입력
- [ ] 사용 설정 활성화
- [ ] 저장

### 테스트
- [ ] 로컬에서 카카오 로그인 테스트 성공
- [ ] Firestore에 사용자 데이터 저장 확인
- [ ] 마이페이지에서 사용자 정보 표시 확인

---

## 📚 참고 문서

- [Firebase Authentication - Custom OAuth](https://firebase.google.com/docs/auth/web/custom-auth)
- [Kakao Developers - 카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Kakao Developers - REST API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)

---

## ✅ 완료!

모든 설정이 완료되면 Google 로그인과 Kakao 로그인 모두 사용 가능합니다! 🚀
