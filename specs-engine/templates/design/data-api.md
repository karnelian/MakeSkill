# Template: 데이터 + API 설계

## 읽어야 할 파일

| 파일 | 필수 | 부재 시 행동 |
|------|:----:|-------------|
| `specs/{프로젝트명}/context.md` | 🔴 | **BLOCK** — 기술 스택/성능 목표 없이 DB/API 설계 불가 |
| `specs/{프로젝트명}/planning/05-product-definition.md` | 🔴 | **BLOCK** — 기능 목록 없이 스키마/엔드포인트 도출 불가 |
| `specs/{프로젝트명}/planning/06-technical-overview.md` | 🔴 | **BLOCK** — 기술 스택 결정 없이 DB/API 기술 선택 불가 |
| `specs/{프로젝트명}/design/ux/screen-mockups.md` | 🟡 | **DEGRADE** — 화면→API 매핑 불가, planning/05-product-definition.md 기능 목록 기반으로 대체 |

## 생성할 파일

### Data — `specs/{프로젝트명}/design/data/`

| 파일명 | 내용 |
|--------|------|
| `db-schema.md` | ERD(텍스트), 테이블/컬렉션 정의 (필드/타입/제약조건), 인덱스, 관계. **기능 ID 매핑 테이블** 포함 |
| `data-dictionary.md` | 필드별 설명, 유효 값 범위, 기본값, 비즈니스 규칙. **SSOT** — 이후 모든 문서의 필드 제약조건 기준 |
| `data-flow.md` | 주요 기능별 데이터 흐름도, 읽기/쓰기 패턴 |
| `migration-strategy.md` | 스키마 버전 관리, 마이그레이션 도구, 롤백 전략 |
| `caching-strategy.md` | 캐시 대상, 무효화 정책, TTL (context.md §7 응답시간 목표 기반) |

유형별 추가: 게임(`game-economy-data.md`, `progression-schema.md`), 모바일(`offline-sync.md`), API서비스(`data-pipeline.md`)

### API — `specs/{프로젝트명}/design/api/`

| 파일명 | 내용 |
|--------|------|
| `api-endpoints.md` | 전체 엔드포인트 표 (Method/Path/설명/인증/Rate Limit). **planning/05-product-definition.md 기능 ID 1:1 매핑** |
| `auth-flow.md` | 인증 플로우 (로그인/토큰 갱신), 인가 모델 (RBAC/ABAC), JWT 관리 |
| `error-handling.md` | 에러 응답 형식 표준화, 에러 코드 카탈로그, HTTP 상태 코드 매핑 |
| `api-rate-limiting.md` | 엔드포인트별 Rate Limit (무료/프리미엄별), 제한 초과 응답, 헤더 |

유형별 추가: API서비스(`resource-modeling.md`, `pagination-strategy.md`), 게임(`server-architecture.md`, `sync-model.md`), 데스크톱(`ipc-design.md`)

## 정합성 규칙

- api-endpoints.md 리소스명 = db-schema.md 테이블/컬렉션명 (SSOT 일치)
- Rate Limit 수치 = planning/05-product-definition.md 프리미엄 비교표 기준 (무료/프리미엄 구분 정확)
- JWT/Token 수명 = auth-flow.md와 security/auth-design.md 동일
- DB 커넥션 풀 ≥ context.md §4-4 피크 동시접속 × 2
- 캐싱 TTL ↔ context.md §7 응답시간 목표 달성 가능

## 품질 기준

- [ ] db-schema.md에 **테이블 ↔ 기능 ID 매핑 테이블** 포함
- [ ] planning/05-product-definition.md §5.4 모든 기능 ID → 테이블 매핑 + 엔드포인트 매핑 확인 (M2 포함)
- [ ] api-endpoints.md 리소스명 ↔ db-schema.md 테이블명 일치
- [ ] Rate Limit 수치 ↔ planning/05-product-definition.md 프리미엄 비교표 일치
- [ ] 공유 설정값 (Rate Limit, 유예기간, 도메인, Token 수명) 문서 간 일관성
- [ ] Locked Decision 태그 정확성 ([S1]~[S5], [A1]~[A14] 정의된 기술만)
- [ ] 단일 문서 내 수치 자기모순 없음
- [ ] context.md §S4 가격/플랜 ↔ API 응답 데이터 1원 단위 일치
- [ ] context.md §4-4 피크 동시접속 ↔ DB 커넥션 풀/캐싱 설계 정합
