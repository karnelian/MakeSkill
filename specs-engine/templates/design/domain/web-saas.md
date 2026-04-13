# Template: 웹 SaaS 도메인 설계

## 읽어야 할 파일

- `specs/{프로젝트명}/context.md` (유형, 가격 정책, 전환율, 성능 목표)
- `specs/{프로젝트명}/planning/05-product-definition.md` (기능 목록, 프리미엄 비교표)
- `specs/{프로젝트명}/planning/06-technical-overview.md` (기술 스택)

## 생성할 파일

### growth/ — 그로스 해커 주도

| 파일명 | 내용 |
|--------|------|
| `conversion-funnel.md` | 전환 퍼널 설계 (방문 → 가입 → 활성 → 유료 전환). 각 단계 목표 전환율 = context.md §4-1 기준 |
| `pricing-page-design.md` | 가격 페이지 설계 (플랜 비교, CTA, FAQ). context.md §S4 가격 정확 반영 |
| `onboarding-optimization.md` | 온보딩 최적화 (단계별 완료율 목표, 이탈 방지 장치, 프로그레시브 프로파일링) |
| `email-flows.md` | 이메일 전략 (웰컴/활성화/전환/재활성화 시퀀스). 트리거 조건, 발송 시점, A/B 테스트 계획 |
| `referral-system.md` | 추천/레퍼럴 프로그램 설계 (보상 구조, 바이럴 루프) — 해당 시 |
| `analytics-events.md` | 추적 이벤트 목록 (퍼널 단계별 핵심 이벤트, 속성 정의) |

### quality/ — QA/접근성/보안/현지화 주도

| 파일명 | 내용 |
|--------|------|
| `accessibility-design.md` | 접근성 설계 (WCAG 2.1 AA 기준, 키보드 내비게이션, 스크린 리더, ARIA 레이블, 색상 대비, 포커스 관리) |
| `security-hardening.md` | 보안 강화 설계 (CSP 정책, CORS, CSRF 토큰, XSS 방어, SQL 인젝션, 의존성 감사, 데이터 암호화) |
| `localization-strategy.md` | 현지화 전략 (i18n 프레임워크, 지원 언어, RTL 대응, 날짜/통화/숫자 포맷, 번역 워크플로우) — 다국어 시 |
| `seo-strategy.md` | SEO 전략 (메타 태그, 시맨틱 HTML, 구조화 데이터, 사이트맵, Core Web Vitals 최적화) |
| `error-monitoring.md` | 에러 모니터링 설계 (Sentry/Datadog, 에러 분류, 알림 정책, 사용자 세션 리플레이) |

## S급 결정 (사용자 확인 필수)

> ⚠️ 아래 항목은 AI가 임의 결정 금지. 반드시 사용자에게 선택지를 제시하고 확정받은 후 context.md Locked Decision에 기록.

| 결정 항목 | 선택지 예시 |
|----------|------------|
| 프론트엔드 프레임워크 | Next.js / Nuxt / SvelteKit / Remix / 기타 |
| 프로그래밍 언어 | TypeScript / JavaScript / Python / Go / 기타 |
| 백엔드/BaaS | Supabase / Firebase / AWS / 자체 서버 / 기타 |
| 호스팅 | Vercel / AWS / GCP / Cloudflare / 기타 |
| DB | PostgreSQL / MySQL / MongoDB / PlanetScale / 기타 |

## 정합성 규칙

- 전환 퍼널 전환율 = context.md §4-1 전환율 수치
- 가격 페이지 플랜/가격 = context.md §S4 + planning/05-product-definition.md 프리미엄 비교표 (셀 단위 일치)
- 이메일 플로우의 프리미엄 기능 언급 = planning/05-product-definition.md 기능 ID 기반
- analytics-events.md 이벤트 = planning/05-product-definition.md 기능 목록 커버
- accessibility-design.md 기준 = WCAG 2.1 AA 이상
- security-hardening.md 정책 = auth-design.md + hosting-decision.md 일치

## 품질 기준

- [ ] growth/ + quality/ 전체 생성
- [ ] conversion-funnel.md 전환율 ↔ context.md §4-1 일치
- [ ] pricing-page-design.md 가격 ↔ §S4 1원 단위 일치
- [ ] onboarding-optimization.md 단계 ↔ planning/05-product-definition.md 온보딩 플로우 일치
- [ ] email-flows.md 트리거 조건이 기능 ID 기반
- [ ] analytics-events.md가 planning/05-product-definition.md 기능 전수 커버
- [ ] accessibility-design.md WCAG 2.1 AA 준수 명세
- [ ] security-hardening.md OWASP Top 10 기반 방어 항목 포함
- [ ] seo-strategy.md Core Web Vitals 목표 ↔ §7 일치
- [ ] Locked Decision 태그 정확성
- [ ] 단일 문서 내 수치 자기모순 없음
