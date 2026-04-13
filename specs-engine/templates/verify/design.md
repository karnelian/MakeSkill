# Template: 설계서 검증 (Design Verify)

## 읽어야 할 파일

| 파일 | 필수 | 부재 시 행동 |
|------|:----:|-------------|
| `specs/{프로젝트명}/context.md` | 🔴 | **BLOCK** — 기술 스택/성능 목표 기준 없이 검증 불가 |
| `specs/{프로젝트명}/planning/05-product-definition.md` | 🔴 | **BLOCK** — 기능 목록 없이 커버리지 검증 불가 |
| `specs/{프로젝트명}/planning/06-technical-overview.md` | 🔴 | **BLOCK** — 기술 스택 기준 없이 P8 실행 불가 |
| `specs/{프로젝트명}/design/` 하위 전체 | 🔴 | **BLOCK** — 검증 대상 없음 |

## 실행할 패턴

### P6: UI 목업 플레이스홀더 검사

- **검증**: 정규식 `\[[가-힣A-Za-z]+\]` 로 스캔 (코드 블록, Feature ID 제외)
- **기준**: `[버튼]`, `[메뉴]`, `[HP바]` 등 텍스트 플레이스홀더 0건 → PASS

### P7: API 엔드포인트 커버리지

- **검증**: planning/05-product-definition.md 기능 ID 목록 vs api-endpoints.md 매핑 테이블 대조
- **기준**: P0 100% + P1 90%+ 커버 → PASS

### P8: 기술스택 정합성

- **검증**: planning/06-technical-overview.md 기술 선택 (호스팅/DB/인증/암호화) vs hosting-decision.md + auth-design.md 대조
- **기준**: 불일치 0건 → PASS

### P9: E2E 테스트 커버리지

- **검증**: planning/05-product-definition.md P0/P1 기능 ID vs e2e-test-scenarios.md 매핑 대조
- **추가**: performance-test-plan.md 수락 기준 ↔ context.md §7 대조
- **기준**: P0 100% + P1 90%+ → PASS, 성능 수치 일치 → PASS

### P14: DB 스키마 ↔ API 필드 매칭

- **검증**: db-schema.md 컬럼명 vs api-endpoints.md request/response 필드 대조
- **기준**: API가 참조하는 필드가 DB에 미정의 → FAIL, 타입 불일치 → WARNING

### P15: API 엔드포인트 ↔ 화면 매핑

- **검증**: screen-mockups.md 인터랙션 → API 엔드포인트 매핑
- **기준**: 화면에서 필요하지만 API에 없는 엔드포인트 → FAIL, API만 있고 화면 없음 → WARNING

### 유형별 P15 추가 체크

| 유형 | 추가 검증 |
|------|----------|
| **게임** | HUD 인터랙션 (HP갱신/스킬사용/인벤토리) → 서버 API 또는 로컬 로직 매핑 |
| **모바일 앱** | 오프라인 화면 → 로컬 DB 접근 매핑, 푸시 알림 → FCM/APNs 엔드포인트 |
| **웹 SaaS** | 결제 플로우 화면 → 결제 API, 대시보드 위젯 → 데이터 조회 API |
| **크롬 확장** | 팝업/사이드패널 인터랙션 → background 메시지 패싱 → API |
| **데스크톱** | 메인 윈도우 인터랙션 → IPC → 백엔드 API |
| **API 서비스** | 개발자 포털 화면 → 관리 API (키 발급/사용량 조회) |

### P16: 보안 설계 ↔ API 인증 매칭

- **검증**: auth-design.md 인증 방식/인가 규칙 vs api-endpoints.md auth 요구사항 대조
- **기준**: 보안에서 "인증 필수"인데 API가 "public" → FAIL, Rate Limit 미반영 → FAIL

### P17: 접근성 설계 정합성

- **검증**: ux/accessibility-guide.md (WCAG 공통) vs 도메인 quality/accessibility-design.md (유형별 특화) 대조
- **Fallback**: ux/accessibility-guide.md 부재 시 → 도메인 quality/accessibility-design.md 단독 검증 (내부 일관성 + 도메인별 최소 기준 충족 여부)
  - 게임: 색맹 모드 + 자막 + 조작 리매핑 + 난이도 옵션 최소 포함
  - 모바일: VoiceOver/TalkBack + 다이나믹 타입 + 터치 타겟 48×48 최소 포함
  - 웹 SaaS: WCAG 2.1 AA 기준 + 키보드 내비게이션 + 스크린 리더 최소 포함
  - 데스크톱/크롬확장: 키보드 내비게이션 + 고대비 최소 포함
- **기준**: 공통 가이드에서 정의한 기준 수준(AA/AAA)이 도메인 설계에 반영 → PASS, 도메인이 공통보다 낮은 기준 → FAIL, Fallback 시 도메인별 최소 항목 충족 → PASS

### P18: 보안 설계 정합성

- **검증**: security/auth-design.md (공통 보안) vs 도메인 quality/security-design.md 또는 security-hardening.md 대조
- **기준**: 공통 보안 정책(인증 방식, 암호화 수준)이 도메인 문서에 동일 반영 → PASS, 불일치 → FAIL
- **추가**: 게임 anti-cheat-design.md의 서버 권위 모델 ↔ multiplayer-arch.md 정합, API security-hardening.md ↔ rate-limit-design.md 정합

### P19: 현지화 전략 정합성 (다국어 프로젝트 시)

- **검증**: 도메인 quality/localization-strategy.md의 지원 언어 목록 ↔ context.md 대상 시장 대조
- **기준**: context.md 대상 시장에 해당하는 언어가 localization-strategy.md에 포함 → PASS, 누락 → WARNING

### P10: STATE.md 동기화

- **검증**: STATE.md Phase 상태 ↔ 실제 파일 존재 여부, Locked Decisions ↔ context.md
- **기준**: 불일치 0건 → PASS

## 생성할 파일

`specs/{프로젝트명}/verify/design-report.md` — 검증 리포트

## 품질 기준

- [ ] P6 텍스트 플레이스홀더 0건
- [ ] P7 API 엔드포인트 P0 100% / P1 90%+ 커버
- [ ] P8 기술스택 planning/06-technical-overview.md ↔ 설계서 일치
- [ ] P9 E2E 테스트 P0 100% / P1 90%+ 커버
- [ ] P14 DB 스키마 ↔ API 필드 미정의 0건
- [ ] P15 화면 → API 누락 0건 (유형별 추가 체크 포함)
- [ ] P16 보안 ↔ API 인증 불일치 0건
- [ ] P17 접근성 공통 가이드 ↔ 도메인 접근성 설계 기준 수준 일치
- [ ] P18 공통 보안 정책 ↔ 도메인 보안 설계 일치
- [ ] P19 현지화 지원 언어 ↔ context.md 대상 시장 일치 (다국어 시)
- [ ] P10 STATE.md ↔ 실제 파일 동기화
