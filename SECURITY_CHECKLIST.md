# 보안 체크리스트 - Git 커밋 전 필수 확인사항

## ⚠️ 민감한 정보 노출 방지

### 1. 환경 변수 파일 확인
다음 파일들이 `.gitignore`에 포함되어 있는지 확인:
- ✅ `.env`
- ✅ `.env.local`
- ✅ `.env.development`
- ✅ `.env.production`

### 2. 소스 코드 내 하드코딩된 키 확인
다음 파일들에 **절대** 하드코딩된 키가 없어야 함:

#### 토스페이먼츠 관련 키
- ❌ `test_ck_DpexMgkW36zqMMlAwj143GbR5ozO` (클라이언트 키)
- ❌ `test_sk_GjLJoQ1aVZ2GK70GjDAJVw6KYe2R` (시크릿 키)
- ❌ `e9d0e00ec06f356f7a8749716b132a0bd4523e082f8905692982d54c7a3c9839` (보안 키)

#### Firebase 관련 키
- Firebase API Key
- Firebase Auth Domain
- Firebase Project ID
- Firebase Storage Bucket
- Firebase Messaging Sender ID
- Firebase App ID
- Firebase Measurement ID

### 3. 현재 확인된 안전한 파일들
- ✅ `src/lib/toss-payments.ts` - 환경 변수 사용
- ✅ `src/app/api/payment/confirm/route.ts` - 서버 사이드에서만 시크릿 키 사용
- ✅ `src/app/payment/success/page.tsx` - API 라우트 사용 (시크릿 키 제거됨)

### 4. Git 커밋 전 체크리스트

```bash
# 1. 민감한 키가 포함된 파일 검색
grep -r "test_ck_" src/
grep -r "test_sk_" src/
grep -r "e9d0e00ec06f" src/

# 2. 환경 변수 파일이 무시되는지 확인
git status | grep ".env"

# 3. .gitignore에 모든 환경 파일이 포함되어 있는지 확인
cat .gitignore | grep "\.env"
```

### 5. 배포 시 주의사항

#### Vercel/Netlify 등 배포 플랫폼
1. 환경 변수는 플랫폼의 Environment Variables 설정에서 관리
2. **절대** 소스 코드에 포함하지 말 것
3. `.env.local.example` 파일만 Git에 포함 (실제 키 값은 제외)

#### Firebase 설정
1. Firebase 키는 Firebase Console에서 관리
2. 환경 변수로만 주입
3. 클라이언트 사이드에서 사용되는 `NEXT_PUBLIC_*` 키는 제한적 권한만 부여

#### 토스페이먼츠 설정
1. **시크릿 키는 절대 클라이언트에 노출하지 말 것**
2. 서버 사이드 API 라우트에서만 사용
3. 클라이언트 키는 `NEXT_PUBLIC_*`로 설정 가능 (도메인 제한 권장)

### 6. 긴급 대응 절차

만약 실수로 민감한 키를 커밋한 경우:

1. **즉시 해당 키를 무효화** (토스페이먼츠/Firebase 콘솔에서 삭제)
2. **새로운 키 발급**
3. **Git 히스토리에서 완전히 제거**:
   ```bash
   # BFG Repo-Cleaner 사용 권장
   # 또는 git filter-branch 사용
   ```
4. **모든 팀원에게 알림**

### 7. 정기 보안 검토
- [ ] 매월 1회: 소스 코드 내 하드코딩된 키 검색
- [ ] 분기별 1회: 환경 변수 키 교체
- [ ] 배포 전: 이 체크리스트 전체 확인

## 📝 현재 프로젝트 상태 (2025-01-03)

### 환경 변수 파일
- ✅ `.env.development` - 로컬 개발용 (gitignored)
- ✅ `.env.local.example` - 예시 파일 (Git 포함)

### API 키 관리 방식
- ✅ 클라이언트 키: 환경 변수로 관리
- ✅ 시크릿 키: 서버 사이드 API에서만 사용
- ✅ 보안 키: 환경 변수로 관리

### 안전하게 구현된 기능
- ✅ 결제 요청: 클라이언트에서 SDK 사용
- ✅ 결제 승인: 서버 API 라우트에서 처리
- ✅ 토스페이먼츠 시크릿 키: 서버에서만 접근 가능
