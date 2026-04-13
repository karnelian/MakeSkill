# Template: UX/UI 설계

## 읽어야 할 파일

| 파일 | 필수 | 부재 시 행동 |
|------|:----:|-------------|
| `specs/{프로젝트명}/context.md` | 🔴 | **BLOCK** — 유형/Locked Decisions 없이 UX 설계 불가 |
| `specs/{프로젝트명}/planning/05-product-definition.md` | 🔴 | **BLOCK** — 기능 목록/유저 플로우 없이 화면 설계 불가 |

## 생성할 파일

생성 디렉토리: `specs/{프로젝트명}/design/ux/`

### 공통 문서 (모든 유형)

| 파일명 | 내용 |
|--------|------|
| `design-system.md` | 디자인 토큰 (컬러 hex, 타이포, 스페이싱, 라운딩), 그리드/레이아웃, 라이트/다크 테마. **SSOT** — 이후 모든 문서는 이 토큰값만 사용 |
| `component-library.md` | 공통 컴포넌트 목록 (Button, Input, Card, Modal 등), variants/states/props, 계층 구조, **기능 ID 매핑 테이블** 포함 |
| `interaction-patterns.md` | 네비게이션 패턴, 폼 인터랙션 (검증/에러/성공), 피드백 패턴 (토스트/알림) |
| `screen-mockups.md` | **모든 주요 화면** 시각 목업 — 아래 시각 표현 규칙 필수 |
| `error-states.md` | 빈 상태(Empty), 에러 상태(404/500/네트워크), 권한 없음 |
| `loading-states.md` | 스켈레톤 UI, 프로그레스, Optimistic UI. context.md §7 성능 목표 기준 |
| `onboarding-flow.md` | 최초 사용자 경험, 튜토리얼, 프로그레시브 디스클로저 |
| `accessibility-guide.md` | WCAG 2.1 준수 수준, 키보드 네비게이션, 스크린 리더, 색상 대비 |

### 시각 목업 규칙 (screen-mockups.md)

- planning/05-product-definition.md §5.4 **모든 기능 ID** 대응 화면 포함 (M1뿐 아니라 M2 이후도)
- planning/05-product-definition.md §5.6 **유저 플로우 전 단계** 화면 포함 — 중간 단계 누락 금지
- 인터랙션 상태: 기본/활성/비활성/로딩/에러
- 화면 간 전환 흐름 (어디서 어디로)
- **텍스트 플레이스홀더 사용 절대 금지**: `[버튼]`, `[메뉴]`, `[HP바]` 같은 텍스트 대체 불가
- UI 요소는 **실제 모양/색/크기**로 명세 (gradient 바, 원형 아이콘, box-shadow 등)
- design-system.md에 없는 hex값 사용 금지

### 유형별 추가 문서

| 유형 | 추가 문서 |
|------|----------|
| **게임** | `hud-design.md` (인게임 HUD 레이아웃), `menu-flow.md` (메뉴 구조), `feedback-system.md` (이펙트/사운드/진동) |
| **모바일 앱** | `screen-flow.md` (화면 전환 플로우), `gesture-patterns.md` (스와이프/롱프레스/핀치) |
| **데스크톱 앱** | `window-layout-spec.md` (윈도우 크기/리사이즈), `keyboard-shortcuts.md` (단축키 맵), `tray-icon-design.md` (시스템 트레이) |
| **크롬 확장** | `popup-design.md` (팝업 UI/크기 제한), `sidepanel-design.md` (사이드패널), `content-overlay-design.md` (웹페이지 오버레이) |
| **웹 SaaS** | `page-layouts.md` (페이지별 와이어프레임), `responsive-strategy.md` (반응형) |
| **API 서비스** | `developer-portal-ux.md` (개발자 포털 UX) |

### 유형별 필수 화면

| 유형 | 필수 화면 |
|------|----------|
| **게임** | 로비, 인게임(HUD), 팝업(레벨업/상점/인벤토리), 결과, 설정 |
| **모바일 앱** | 온보딩/로그인, 홈, 상세, 프로필/설정, 검색, 알림 |
| **웹 SaaS** | 랜딩, 로그인/가입, 대시보드, 상세/편집, 설정/빌링, 가격 |
| **API 서비스** | 개발자포털, API 레퍼런스, 대시보드, 키관리 |
| **크롬 확장** | 팝업, 사이드패널, 콘텐츠오버레이, 옵션 |
| **데스크톱 앱** | 메인윈도우, 설정, 트레이메뉴, 파일선택 |

## 품질 기준

- [ ] design-system.md 생성 (컬러/타이포/스페이싱/테마 토큰 전수 정의)
- [ ] component-library.md에 **기능 ID 매핑 테이블** 포함
- [ ] screen-mockups.md — planning/05-product-definition.md §5.4 기능 ID 전수 대조 (M2 이후 포함)
- [ ] screen-mockups.md — 유형별 필수 화면 전체 포함
- [ ] screen-mockups.md — 텍스트 플레이스홀더(`[버튼]`, `[메뉴]`) 0건
- [ ] screen-mockups.md — planning/05-product-definition.md §5.6 유저 플로우 전 단계 화면 포함
- [ ] 모든 문서의 색상값이 design-system.md 토큰과 일치
- [ ] 문서 간 공유 UI 동작 (탭 수, 숨김 여부, 라벨) 일관성 확인
- [ ] planning/05-product-definition.md 정본 수량 (카테고리, 탭, 온보딩 단계) 일치
- [ ] context.md §S4 가격 ↔ 가격 페이지/구독 화면 1원 단위 일치
- [ ] loading-states.md 타임아웃 기준 ↔ context.md §7 Performance Targets 범위 내
