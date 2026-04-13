# Template: 크롬 확장 도메인 설계

## 읽어야 할 파일

- `specs/{프로젝트명}/context.md` (유형, 기술 스택, 성능 목표)
- `specs/{프로젝트명}/planning/05-product-definition.md` (기능 목록)
- `specs/{프로젝트명}/planning/06-technical-overview.md` (지원 브라우저 버전)

## 생성할 파일

### platform/ — 웹 플랫폼 전문가 주도

| 파일명 | 내용 |
|--------|------|
| `manifest-v3-design.md` | Manifest V3 설정 상세 (권한 선언, host_permissions, 서비스 워커 수명 관리) |
| `content-script-strategy.md` | 콘텐츠 스크립트 설계 (주입 시점/대상, 페이지 DOM 접근 범위, 주요 사이트 호환성) |
| `background-service-worker.md` | 서비스 워커 설계 (알람/이벤트 기반, 상태 유지, 메시지 패싱, 스토리지) |
| `cross-browser-plan.md` | 크로스 브라우저 계획 (Chrome/Edge/Firefox 차이점, 폴리필) |

### privacy/ — 프라이버시 전문가 주도

| 파일명 | 내용 |
|--------|------|
| `permissions-design.md` | 권한 사용 근거 (각 권한별 필요성 설명, 최소 권한 원칙) |
| `data-handling.md` | 데이터 수집/저장/삭제 명세, 개인정보처리방침 초안, 웹스토어 심사 컴플라이언스 |

### quality/ — QA/접근성 주도

| 파일명 | 내용 |
|--------|------|
| `accessibility-design.md` | 접근성 설계 (팝업/사이드패널 키보드 내비게이션, ARIA, 고대비 테마, 스크린 리더 호환) |
| `localization-strategy.md` | 현지화 전략 (chrome.i18n API, _locales 구조, 지원 언어, 웹스토어 현지화) — 다국어 시 |

### aso/ — 웹스토어 최적화

| 파일명 | 내용 |
|--------|------|
| `webstore-listing.md` | 웹스토어 등록 정보 (이름, 설명, 스크린샷 구성, 카테고리) |
| `review-strategy.md` | 리뷰 관리 전략 (리뷰 요청 시점, 부정 리뷰 대응) |

## S급 결정 (사용자 확인 필수)

> ⚠️ 아래 항목은 AI가 임의 결정 금지. 반드시 사용자에게 선택지를 제시하고 확정받은 후 context.md Locked Decision에 기록.

| 결정 항목 | 선택지 예시 |
|----------|------------|
| UI 프레임워크 | React / Vue / Svelte / Vanilla JS / 기타 |
| 프로그래밍 언어 | TypeScript / JavaScript |
| 빌드 도구 | Vite / Webpack / Plasmo / WXT / 기타 |

## 정합성 규칙

- 최소 브라우저 버전 = planning/06-technical-overview.md 지원 환경 + qa/browser-version-matrix.md 일치
- 권한 목록 = manifest-v3-design.md ↔ permissions-design.md ↔ data-handling.md 동일
- 기능 언급 시 planning/05-product-definition.md 기능 ID(F-xx-xx) 명시

## 품질 기준

- [ ] platform/ + privacy/ + quality/ 전체 생성
- [ ] manifest-v3-design.md에 권한 사용 근거 포함
- [ ] 최소 브라우저 버전 ↔ planning/06-technical-overview.md + qa/ 문서 일치
- [ ] data-handling.md에 웹스토어 심사 요구사항 반영
- [ ] accessibility-design.md 생성 (키보드/스크린 리더 호환 명세)
- [ ] 기능 ID 전수 참조
- [ ] Locked Decision 태그 정확성
- [ ] 단일 문서 내 수치 자기모순 없음
