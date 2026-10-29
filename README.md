# 링크드림 LinkDrim

한 번의 정보 입력으로 개인 프로필, 디지털 명함, 멀티링크를 관리하는 SaaS 플랫폼.

## 로컬 설치

1. `npm install`
2. `.env.example`을 `.env.local`로 복사하고 Supabase URL/Publishable Key/Service Role Key를 입력합니다.
3. Supabase SQL Editor에서 `db/migrations/001_core.sql`을 새 DB에 실행합니다.
4. Supabase Auth에서 Google/Kakao 및 Custom OAuth `custom:naver`를 설정하고 콜백 URL(`http://localhost:3000/auth/callback`)을 허용합니다.
5. 첫 최고 관리자 계정으로 한 번 로그인한 후 SQL 주석에 있는 bootstrap 쿼리로 `app_users.role=super_admin`을 지정합니다.
6. `npm run dev` 실행 후 `/admin`에서 고객 사이트를 생성합니다.
7. `npm run check`로 ESLint, TypeScript, Next Build 검증합니다.

## 배포

- Vercel에서 GitHub 프로젝트 연결, 위 환경변수 설정, 메인 도메인 `linkdrim.com` 연결
- 고객 납품 시에는 Vercel 상업용 Pro 요금제가 필요합니다.
- Supabase Storage 정책은 SQL 파일에 포함되어 있습니다.
- 기능 범위 및 배포 전 필수 작업: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- 병원 콘텐츠를 참조 ZIP에서 복사하지 않으며, 구조/컴포넌트 패턴만 참조했습니다.

## URL

- `/` 서비스 소개
- `/login` 소셜 로그인
- `/admin` 최고 관리자
- `/dashboard` 성과 분석
- `/dashboard/manage` 페이지 관리
- `/demo/profile`, `/demo/business-card`, `/demo/link` 데모
- `/<slug>/<template>` 고객별 공개 페이지

> 이 커밋은 **기반 구축 1차**입니다. 110개 인터뷰의 모든 기능이 완료됐다는 의미는 아닙니다. 운영 전 보안·Notion·도메인·통계 및 인증 테스트를 추가해야 합니다.

## 개발 및 패치 전달 규칙

Tailwind `className`, ZIP 패치 및 Mac 설치 스크립트, Git 커밋 규칙은 [`docs/DELIVERY_CONVENTIONS.md`](docs/DELIVERY_CONVENTIONS.md)를 참조하세요.
