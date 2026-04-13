# Template: 개발 가이드 검증 (Implementation Verify)

## 읽어야 할 파일

| 파일 | 필수 | 부재 시 행동 |
|------|:----:|-------------|
| `specs/{프로젝트명}/context.md` | 🔴 | **BLOCK** — S/A코드 기준 없이 P4 태그 검증 불가 |
| `specs/{프로젝트명}/planning/05-product-definition.md` | 🔴 | **BLOCK** — Feature ID 없이 P-NEW-2 커버리지 검증 불가 |
| `specs/{프로젝트명}/planning/06-technical-overview.md` | 🔴 | **BLOCK** — 마일스톤/기술스택 기준 없이 검증 불가 |
| `specs/{프로젝트명}/implementation/` 하위 전체 | 🔴 | **BLOCK** — 검증 대상 없음 |

## 실행할 패턴

### P4: A-code/S-code 태그 정확성

- **검증**: 태스크 파일의 [A코드], [S코드] 태그 추출 → context.md Locked Decisions 대조
- **추가**: 태스크 내용과 A-code 정의가 **직접적으로** 관련되는지 확인
- **기준**: 오태그 0건 → PASS
- **FAIL 예시**: 암호화 태스크에 [A2](클립보드 API) 태그 → 오태그

### P10: STATE.md 동기화

- **검증**: STATE.md Implementation 상태 ↔ 실제 파일 존재 여부
- **기준**: 불일치 0건 → PASS

### P-NEW-1: 태스크 원자성 검증

- **검증**: 모든 태스크의 시간 단위 확인
- **기준**: 4h 초과 태스크 0건 → PASS
- **추가**: 각 태스크에 파일 경로 명시 여부 확인 (미명시 → WARNING)
- **FAIL 시**: 4h 초과 태스크를 더 작은 단위로 분해

### P-NEW-2: Feature 커버리지 검증

- **검증**: planning/05-product-definition.md §5.4 기능 ID 전수 → implementation/tasks/ 태스크 매핑 확인
- **추가**: milestone-overview.md 기능 ID ↔ 이름 = planning/05-product-definition.md 원문 복사 여부
- **기준**: 미커버 기능 0건, ID↔이름 불일치 0건 → PASS
- **검증 항목**:
  - 마일스톤 이름/기간 ↔ planning/06-technical-overview.md 원문 일치
  - 기능→마일스톤 배정 ↔ planning/06-technical-overview.md 원문 일치
  - S코드 전수(S1~Sn) 최소 1회 등장
  - S/A-code 정의 테이블 ↔ context.md 글자 단위 일치
  - Pricing/Free 티어 수치 ↔ SSOT 원문 복사

## 생성할 파일

`specs/{프로젝트명}/verify/impl-report.md` — 검증 리포트

## 품질 기준

- [ ] P4 A-code/S-code 태그 전수 정확
- [ ] P10 STATE.md 동기화
- [ ] P-NEW-1 태스크 전체 4h 이하 (파일 경로 명시)
- [ ] P-NEW-2 planning/05-product-definition.md 기능 ID 전수 커버
- [ ] 마일스톤 이름/기간 ↔ planning/06-technical-overview.md 원문 일치
- [ ] 기능 ID↔이름 ↔ planning/05-product-definition.md 원문 복사
- [ ] S코드 전수 등장 확인
- [ ] S/A-code 정의 테이블 ↔ context.md 복사 일치
- [ ] Pricing/Free 수치 ↔ SSOT 일치
