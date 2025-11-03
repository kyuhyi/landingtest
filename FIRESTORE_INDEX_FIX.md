# 🔥 Firestore 인덱스 생성 가이드

## 문제 상황

```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/bsd-test-6de41/firestore/indexes?create_composite=...
```

이 에러는 **Firestore에서 복합 쿼리를 실행할 때 필요한 인덱스가 없기 때문**입니다.

---

## 🚀 빠른 해결 방법

### 방법 1: 에러 메시지의 링크 클릭 (가장 쉬움)

1. 브라우저 콘솔에서 에러 메시지를 찾습니다
2. 에러 메시지에 있는 **긴 URL 링크**를 클릭합니다
   ```
   https://console.firebase.google.com/v1/r/project/bsd-test-6de41/firestore/indexes?create_composite=...
   ```
3. Firebase Console이 자동으로 열리면서 **인덱스 생성 화면**이 표시됩니다
4. **인덱스 만들기** 버튼 클릭
5. 인덱스 생성 완료까지 **3-5분** 대기

### 방법 2: 수동 인덱스 생성

1. Firebase Console 접속:
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

### 1. orders 컬렉션 인덱스

주문 내역을 사용자별로 조회할 때 필요합니다.

```yaml
컬렉션 ID: orders
필드:
  - userId (오름차순)
  - createdAt (내림차순)
쿼리 범위: 컬렉션
```

#### 수동 생성 방법:
1. **컬렉션 ID**: `orders` 입력
2. **필드 추가** 클릭
   - **필드 경로**: `userId`
   - **정렬 방향**: `오름차순`
3. **필드 추가** 클릭
   - **필드 경로**: `createdAt`
   - **정렬 방향**: `내림차순`
4. **쿼리 범위**: `컬렉션` 선택
5. **만들기** 버튼 클릭

### 2. reviews 컬렉션 인덱스 (상품 리뷰용)

```yaml
컬렉션 ID: reviews
필드:
  - productId (오름차순)
  - createdAt (내림차순)
쿼리 범위: 컬렉션
```

### 3. reviews 컬렉션 인덱스 (사용자 리뷰용)

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
- **대용량 데이터**: 데이터가 많으면 더 오래 걸릴 수 있음

### 진행 상태 확인

1. Firebase Console → Firestore Database → 인덱스
2. 복합 인덱스 탭에서 상태 확인:
   - 🟡 **빌드 중**: 인덱스 생성 중
   - 🟢 **사용 설정됨**: 인덱스 사용 가능
   - 🔴 **오류**: 인덱스 생성 실패

---

## 🔍 현재 필요한 인덱스

### 에러 메시지 분석

에러 콘솔에 다음과 같은 메시지가 표시됩니다:
```
The query requires an index. You can create it here:
https://console.firebase.google.com/v1/r/project/bsd-test-6de41/firestore/indexes?create_composite=Ck1wcm9qZWN0cy9ic2QtdGVzdC02ZGU0MS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvb3JkZXJzL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI
```

이 URL을 **그대로 클릭**하면 자동으로 인덱스 생성 화면으로 이동합니다.

---

## ✅ 인덱스 생성 완료 확인

### 테스트 절차

1. 인덱스 상태가 **사용 설정됨**으로 변경될 때까지 대기

2. 개발 서버 새로고침 또는 재시작:
   ```bash
   # Ctrl+C로 서버 중지 후
   npm run dev
   ```

3. 로그인 후 마이페이지 접속:
   ```
   http://localhost:3000/mypage
   ```

4. **최근 주문** 위젯에서 데이터 확인

5. **주문내역** 페이지 접속:
   ```
   http://localhost:3000/mypage/orders
   ```

6. 주문 데이터가 정상적으로 표시되는지 확인

### 콘솔 로그 확인

인덱스가 정상 작동하면 다음과 같은 로그가 출력됩니다:
```
📦 최근 주문내역 로딩 중...
✅ 주문내역 로딩 완료: N건
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

### 주문 데이터가 표시되지 않음
**원인**: 아직 주문 데이터가 없음
**해결**:
1. 상품 결제 테스트 진행
2. 결제 성공 후 Firestore Database → `orders` 컬렉션 확인
3. 데이터가 있는데도 표시되지 않으면 콘솔 에러 확인

---

## 📊 인덱스 사용 현황

### Firestore 쿼리별 필요 인덱스

| 쿼리 위치 | 컬렉션 | 필드 | 목적 |
|----------|--------|------|------|
| [mypage/page.tsx:20](c:\project\landing\src\app\mypage\page.tsx#L20) | orders | userId, createdAt | 사용자별 최근 주문 |
| [mypage/orders/page.tsx:110](c:\project\landing\src\app\mypage\orders\page.tsx#L110) | orders | userId, createdAt | 전체 주문내역 |
| 리뷰 시스템 | reviews | productId, createdAt | 상품 리뷰 목록 |
| 리뷰 시스템 | reviews | userId, createdAt | 사용자 리뷰 목록 |

---

## 🎯 체크리스트

### 인덱스 생성
- [ ] `orders` 컬렉션 인덱스 (userId + createdAt) 생성
- [ ] 인덱스 상태 "사용 설정됨" 확인
- [ ] 개발 서버 재시작

### 기능 테스트
- [ ] 마이페이지 접속 시 에러 없음
- [ ] 최근 주문 위젯 정상 표시
- [ ] 주문내역 페이지 정상 동작
- [ ] 콘솔에 Firestore 에러 없음

---

## 📚 참고 문서

- [Firestore 인덱스 관리](https://firebase.google.com/docs/firestore/query-data/indexing)
- [복합 인덱스 생성](https://firebase.google.com/docs/firestore/query-data/index-overview#composite_indexes)
- [인덱스 제한사항](https://firebase.google.com/docs/firestore/quotas#indexes)

---

## ✅ 완료!

인덱스 생성이 완료되면 모든 Firestore 쿼리가 정상 작동합니다! 🎉
