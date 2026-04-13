# Template: API 서비스 도메인 설계

## 읽어야 할 파일

- `specs/{프로젝트명}/context.md` (유형, 가격 정책, 성능 목표, SLA)
- `specs/{프로젝트명}/planning/05-product-definition.md` (기능 목록, Rate Limit 정책)
- `specs/{프로젝트명}/planning/06-technical-overview.md` (기술 스택)
- `specs/{프로젝트명}/design/api/api-endpoints.md` (엔드포인트 목록)

## 생성할 파일

### docs/ — 문서 전문가 주도

| 파일명 | 내용 |
|--------|------|
| `api-reference-design.md` | API 레퍼런스 문서 구조 설계 (엔드포인트별 상세, 요청/응답 예시, 에러 코드). OpenAPI/Swagger 연동 |
| `sdk-design.md` | SDK 개발 계획 (지원 언어, 코드 생성 전략, 버전 관리, 배포 채널) |
| `developer-portal.md` | 개발자 포털 설계 (빠른 시작 가이드, 인증 플로우 가이드, 코드 예제, 변경 로그) |

### integration/ — 통합 설계자 주도

| 파일명 | 내용 |
|--------|------|
| `webhook-design.md` | 웹훅 설계 (이벤트 목록, 페이로드 형식, 서명 검증, 재시도 정책) |
| `rate-limit-design.md` | Rate Limit 상세 설계 (플랜별 제한, 버스트 허용, 헤더 규격). planning/05-product-definition.md 프리미엄 비교표 기준 |
| `versioning-strategy.md` | API 버전 관리 전략 (URL/헤더 방식, 하위 호환성 정책, Deprecation 프로세스, 마이그레이션 가이드) |

### observability/ — 인프라/모니터링 주도

| 파일명 | 내용 |
|--------|------|
| `monitoring-design.md` | 모니터링 설계 (헬스체크 엔드포인트, 메트릭 수집, 대시보드 구성, SLA 추적 지표) |
| `logging-strategy.md` | 로깅 전략 (구조화 로그 형식, 로그 레벨 정책, 요청 추적 ID, 로그 보관/로테이션) |
| `alerting-design.md` | 알림 설계 (에러율/레이턴시/가용성 임계값, 알림 채널, 에스컬레이션 정책, On-call 연동) |
| `security-hardening.md` | 보안 강화 (입력 검증, SQL 인젝션 방어, 의존성 감사, 시크릿 관리, 감사 로그) |

## S급 결정 (사용자 확인 필수)

> ⚠️ 아래 항목은 AI가 임의 결정 금지. 반드시 사용자에게 선택지를 제시하고 확정받은 후 context.md Locked Decision에 기록.

| 결정 항목 | 선택지 예시 |
|----------|------------|
| 서버 언어/프레임워크 | Node.js (Express/Fastify) / Go (Gin/Echo) / Python (FastAPI) / Rust (Axum) / 기타 |
| DB | PostgreSQL / MySQL / MongoDB / DynamoDB / 기타 |
| 호스팅 | AWS / GCP / Azure / Cloudflare Workers / 기타 |
| API 스타일 | REST / GraphQL / gRPC / tRPC / 기타 |

## 정합성 규칙

- Rate Limit 수치 = planning/05-product-definition.md 프리미엄 비교표 + context.md §S4 (정확 일치)
- SLA 수치 (업타임, 레이턴시) = context.md §7 Performance Targets
- api-reference-design.md 엔드포인트 = api-endpoints.md 전수 커버
- monitoring-design.md SLA 지표 = context.md §7 + rate-limit-design.md 일치
- alerting-design.md 임계값 = monitoring-design.md 지표 기반
- 기능 언급 시 planning/05-product-definition.md 기능 ID(F-xx-xx) 명시

## 품질 기준

- [ ] docs/ + integration/ + observability/ 전체 생성
- [ ] api-reference-design.md ↔ api-endpoints.md 전수 커버
- [ ] rate-limit-design.md 수치 ↔ planning/05-product-definition.md 프리미엄 비교표 일치
- [ ] sdk-design.md 지원 언어/배포 계획 명시
- [ ] versioning-strategy.md Deprecation 프로세스 포함
- [ ] monitoring-design.md 헬스체크 + SLA 추적 포함
- [ ] logging-strategy.md 구조화 로그 + 요청 추적 ID 포함
- [ ] alerting-design.md 임계값 ↔ SLA 수치 정합
- [ ] security-hardening.md OWASP API Top 10 기반
- [ ] SLA 수치 ↔ §7 일치
- [ ] 기능 ID 전수 참조
- [ ] Locked Decision 태그 정확성
- [ ] 단일 문서 내 수치 자기모순 없음
