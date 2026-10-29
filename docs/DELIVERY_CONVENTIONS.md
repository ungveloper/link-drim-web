# LinkDrim 개발·패치 배포 규칙

링크드림(LinkDrim) 프로젝트의 사용자 합의 사항입니다.

## 코드 스타일

- Tailwind CSS를 JSX/TSX의 `className`에 작성합니다. 별도의 페이지·컴포넌트 CSS 파일 또는 CSS Module을 작성하지 않습니다.
- `app/globals.css`는 Tailwind 진입용 `@import "tailwindcss";`만 둡니다.
- 재사용하는 UI는 공통 컴포넌트로 분리하고, 템플릿 페이지는 `_sections`, `_components` 패턴을 따릅니다.

## 전달물

- 향후 코드 추가 및 수정은 **압축 파일(ZIP)** 로 전달합니다.
- ZIP 내부에는 추가·수정된 코드와 macOS용 `apply.command`, 적용 안내 문서가 있어야 합니다.
- 설치 대상 경로는 **`/Users/ungveloper/Desktop/UNG/link-drim-web`** 입니다.
- `~/Downloads`에 ZIP을 내려받은 뒤 압축 해제 및 스크립트 실행 한 줄로 적용할 수 있어야 합니다.
- 스크립트는 기존 파일을 백업한 뒤 적용하고, `npm run check` 성공 시 Git 커밋과 `git push -u origin main`까지 실행해야 합니다.
- 검증에 실패하거나 로컬의 미커밋 변경이 있다면 사용자 코드를 보호하고 자동 푸시하지 않습니다.

## Git 커밋 메시지

- `추가: ...` — 이전에 없던 새로운 기능이 추가되었을 때만 사용
- `고침: ...` — 오류·버그를 수정할 때 사용
- `변경: ...` — 그 외 일반적인 변경·정리·수정 작업에 사용

## 환경 파일 및 보안

- `.env.local`, 실제 토큰/비밀키는 압축 파일에 포함하거나 Git에 커밋하지 않습니다.
- `.env.example`은 자리표시자만 기록하고 필요할 때 명시적으로 추적합니다.
- 프로덕션 직접 푸시 전에는 스크립트에서 구조·ESLint·타입·빌드 검증을 통과해야 합니다.
