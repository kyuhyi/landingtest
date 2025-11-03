# BSD 바이브코딩 랜딩페이지

Next.js + Firebase + Vercel로 구축된 BSD 바이브코딩 온라인 VOD 랜딩페이지입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: Vercel
- **Package Manager**: npm

## 주요 기능

- ✨ 반응형 랜딩페이지
- 🔐 로그인/회원가입 (Google, Kakao OAuth + 이메일)
- 💬 AI 챗봇
- 🎨 Glassmorphism UI 디자인
- 📱 모바일 최적화
- ⚡ Next.js App Router 사용

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Firebase 설정을 추가하세요:

```bash
cp .env.local.example .env.local
```

Firebase Console에서 프로젝트를 생성하고 아래 정보를 입력하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 빌드 및 배포

### 로컬 빌드

```bash
npm run build
npm start
```

### Vercel 배포

1. Vercel 계정과 연결:

```bash
npm install -g vercel
vercel login
```

2. 프로젝트 배포:

```bash
vercel
```

3. 환경 변수 설정:
   - Vercel 대시보드에서 프로젝트 설정 → Environment Variables
   - `.env.local`의 모든 변수를 추가

4. 프로덕션 배포:

```bash
vercel --prod
```

## 프로젝트 구조

```
c:\project\landing\
├── public/              # 정적 파일 (이미지 등)
│   └── images/
├── src/
│   ├── app/            # Next.js App Router 페이지
│   │   ├── login/
│   │   ├── signup/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/     # React 컴포넌트
│   │   ├── Header.tsx
│   │   └── Chatbot.tsx
│   └── lib/           # 유틸리티 함수
│       └── firebase.ts
├── .env.local.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## Firebase 설정

### Authentication

Firebase Console에서 Authentication을 활성화하고 다음 로그인 방법을 설정하세요:

- Google
- Kakao (커스텀 OAuth 공급자로 추가)
- Email/Password

### Firestore Database

필요한 컬렉션:
- `users`: 사용자 정보
- `leads`: 리드 폼 데이터

## 라이선스

Private - BSD 바이브코딩

## 문의

- 웹사이트: [BSD 바이브코딩](https://bsdcoding.com)
- 이메일: contact@bsdcoding.com
