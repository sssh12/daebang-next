# Daebang-Next

대방 프로젝트 Next.js 마이그레이션

## 기술 스택

- **프론트엔드**: Next.js (App Router), Tailwind CSS, React Hook Form, Zod, Lucide-react
- **백엔드**: Next.js API Routes
- **데이터베이스**: Supabase
- **데이터 접근**: supabase-js
- **인증**: NextAuth.js (Auth.js)
- **파일 스토리지**: Supabase Storage
- **지도 API**: 카카오맵 API
- **배포/호스팅**: Vercel

## 파일 유형별 규칙

| 파일 유형           | 규칙                | 예시                                 |
| ------------------- | ------------------- | ------------------------------------ |
| 리액트 컴포넌트     | 대문자 (PascalCase) | Nav.jsx, Modal.tsx, MainCard.js      |
| 페이지/라우팅 파일  | 소문자              | page.tsx, layout.js, [slug]/page.tsx |
| 기타 로직/유틸 파일 | 관례적으로 소문자   | lib/utils.ts, services/api.js        |

## 커밋 메시지 규칙

- **형식**: `<타입>(<범위>): <설명>`
- **타입**:
  - feat: 새로운 기능 추가
  - fix: 버그 수정
  - docs: 문서 수정
  - style: 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음)
  - refactor: 코드 리팩토링 (기능 변경 없음)
  - test: 테스트 코드 추가/수정
  - chore: 빌드 업무 수정, 패키지 매니저 설정 등 (기능 변경 없음)
- **범위**: 변경된 파일이나 기능의 범위 (선택 사항)
- **설명**: 변경 사항에 대한 간단한 설명 (현재 시제 사용)
- **예시**:
  - feat(auth): 로그인 기능 추가
  - fix(api): 데이터 페칭 버그 수정
  - docs: README.md 업데이트
  - style: 코드 포맷팅 적용
  - refactor: 컴포넌트 구조 개선
  - test: 유닛 테스트 추가
  - chore: 패키지 업데이트
