# Template: 보안 + 인프라 + QA 설계

## 읽어야 할 파일

| 파일 | 필수 | 부재 시 행동 |
|------|:----:|-------------|
| `specs/{프로젝트명}/context.md` | 🔴 | **BLOCK** — 기술 스택/인프라 비용 기준 없이 설계 불가 |
| `specs/{프로젝트명}/planning/05-product-definition.md` | 🔴 | **BLOCK** — 기능 목록 없이 테스트 커버리지 정의 불가 |
| `specs/{프로젝트명}/planning/06-technical-overview.md` | 🔴 | **BLOCK** — 기술 스택/성능 목표 없이 인프라 설계 불가 |
| `specs/{프로젝트명}/design/api/auth-flow.md` | 🔴 | **BLOCK** — 인증 방식 없이 보안 설계 불가 (병렬 실행 시 UX+Data-API 에이전트 완료 대기) |
| `specs/{프로젝트명}/design/api/api-endpoints.md` | 🔴 | **BLOCK** — 엔드포인트 없이 Rate Limit/보안 매핑 불가 |
| `specs/{프로젝트명}/design/data/db-schema.md` | 🟡 | **DEGRADE** — 민감 데이터 분류 불가, 범용 보안 정책 적용 |
| `specs/{프로젝트명}/design/data/data-dictionary.md` | 🟡 | **DEGRADE** — 필드 제약 미참조, 범용 검증 적용 |

## 생성할 파일

### Security — `specs/{프로젝트명}/design/security/`

| 파일명 | 내용 |
|--------|------|
| `auth-design.md` | 인증 아키텍처, 비밀번호 정책, MFA, 세션 관리, 소셜 로그인. auth-flow.md와 동일 정책 |
| `authorization-model.md` | RBAC 매트릭스, 리소스별 접근 제어, API별 권한 매핑 |
| `encryption-spec.md` | TLS 전송 암호화, DB/파일 저장 암호화, PII 분류 |
| `audit-logging.md` | 로깅 대상 이벤트, 로그 형식(구조화), 보관 기간 |

유형별 추가: 크롬확장(`csp-policy.md`), 게임(`anti-cheat-design.md`)

### Infra — `specs/{프로젝트명}/design/infra/`

| 파일명 | 내용 |
|--------|------|
| `hosting-decision.md` | 호스팅 선택 근거 (비용/성능/확장성). planning/06-technical-overview.md 기술 스택 일치 필수 |
| `ci-cd-pipeline.md` | 빌드/테스트/배포 파이프라인. 단위 테스트 커버리지 목표 포함 |
| `monitoring-strategy.md` | 모니터링 대상, 알림 규칙, 대시보드. context.md §7 임계치 기반 |
| `scaling-plan.md` | 오토스케일링 조건, 수평/수직 확장. 최대값 ≥ §4-4 피크 × 1.5 |

유형별 추가: API서비스(`load-balancing.md`, `cost-estimation.md`), 데스크톱(`auto-update-infra.md`, `code-signing-infra.md`), 게임(`game-server-infra.md`)

### QA — `specs/{프로젝트명}/design/qa/`

| 파일명 | 내용 |
|--------|------|
| `test-plan.md` | 테스트 전략 총괄 (범위/수준/도구/일정) |
| `e2e-test-scenarios.md` | 주요 플로우별 E2E 시나리오. **P0 100% / P1 90%+ 커버리지**. 기능 ID 매핑 테이블 포함 |
| `performance-test-plan.md` | 성능 목표 (context.md §7 수치 정확 인용), 부하 테스트 시나리오 (피크 × 1.5) |
| `compatibility-matrix.md` | 유형별 호환성 매트릭스 (브라우저/디바이스/OS) |

유형별 추가: 게임(`balance-test-plan.md`, `performance-benchmarks.md`), 모바일(`device-matrix.md`), API서비스(`load-test-plan.md`, `contract-test-plan.md`)

## 정합성 규칙

- auth-design.md 인증 방식/토큰 수명 = auth-flow.md (정확히 동일)
- 인증 Rate Limit = api-rate-limiting.md 수치 일치
- input-validation 필드 제약조건 = data-dictionary.md SSOT
- 인프라 비용 합계 = context.md §4-3 연간 합계
- 모니터링 알림 임계치 ≤ context.md §7 Performance Targets (느슨하면 FAIL)
- 성능 테스트 수락 기준 = context.md §7 수치 (1ms라도 불일치 → FAIL)
- 부하 테스트 최대 동시접속 ≥ §4-4 피크 × 1.5

## 품질 기준

- [ ] auth-design.md ↔ auth-flow.md 인증 정책 일치
- [ ] encryption-spec.md에 PII 분류 포함 (db-schema.md 연동)
- [ ] audit-logging.md 보관 기간 ↔ data-retention-policy 일치
- [ ] hosting-decision.md ↔ planning/06-technical-overview.md 기술 스택 일치
- [ ] ci-cd-pipeline.md 커버리지 목표 일관성
- [ ] monitoring-strategy.md 알림 임계치 ↔ §7 Performance Targets 이내
- [ ] scaling-plan.md 최대값 ≥ §4-4 피크 × 1.5
- [ ] e2e-test-scenarios.md P0 100% / P1 90%+ 커버리지 (기능 ID 매핑 테이블 포함)
- [ ] performance-test-plan.md 수락 기준 = context.md §7 수치 정확 일치
- [ ] 공유 설정값 (도메인, TLS, OS버전, 커버리지) 문서 간 일관성
- [ ] Locked Decision 태그 정확성 (보조 도구에 태그 미부여)
- [ ] context.md §4-3 인프라 비용 항목별 대조 통과
