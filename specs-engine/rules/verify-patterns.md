# Verify Patterns — 검증 패턴 전체 목록

Phase별로 자동 적용되는 검증 패턴. 각 패턴은 ID, 이름, 검증 방법, PASS/FAIL 기준, 자동 수정 가능 여부를 포함한다.

---

## Planning Phase 패턴

### P1: Contract SSOT 수치 정합성
- **대상**: 기획서 Phase 이후 (Research는 context.md로 폴백)
- **검증**: `_contract.md C1(가격), C2(핵심 수치)`에서 수치 추출 → 전 챕터 Grep 대조
- **PASS**: 불일치 0건
- **FAIL**: 어떤 챕터든 contract 수치와 다른 값 사용
- **자동 수정**: 가능 — contract 값으로 대상 챕터 덮어쓰기

### P2: Contract 기능/마일스톤 스코프
- **대상**: Planning, Presentation, Infographic
- **검증**:
  1. `C4(Feature Registry)`에서 v1=❌ 기능 목록 추출 → 전 챕터 Grep
  2. `C5(Milestones)` 라벨/기간 → 전 챕터 마일스톤 표현 대조
- **PASS**: v1=❌ 기능이 v1 맥락에서 사용 0건 + 마일스톤 라벨 일치
- **FAIL**: v2 기능이 v1 타임라인/과금표/기능 매트릭스에 등장
- **자동 수정**: 가능 — v2 기능 언급 제거 또는 "v2 예정"으로 표기

### P3: 시나리오 수치 원문 복사
- **대상**: Planning ch07, Presentation, Infographic
- **검증**: ch07 시나리오 테이블(Conservative/Base/Optimistic)과 대상 문서 수치 1:1 대조
- **PASS**: 불일치 0건 + 산술 오류 0건
- **FAIL**: 단순 배율(60%, 130%) 적용 또는 수치 불일치
- **자동 수정**: 가능 — ch07 원문 복사

### P5: 출처율 검증
- **대상**: Research + Planning
- **검증**: `[출처:]` 및 `[추정]` 태그 수 카운트 → 비율 계산
- **PASS**: 80% 이상
- **WARNING**: 70~80%
- **FAIL**: 70% 미만

#### P5-B: 태그 부재 챕터 감지 + 자동 보강
- **대상**: ch02~ch09 (수치 의존 챕터)
- **검증**: 챕터별 태그 수 카운트 → 수치 포함 챕터에 태그 0건 → CONDITIONAL
- **자동 보강**:
  1. 태그 0건 챕터에서 핵심 수치 3~5개 추출
  2. 각 수치에 WebSearch (최대 3회/챕터)
  3. 성공 → `[출처: {URL}]` 삽입 / 실패 → `[추정: {근거}]` 삽입
  4. 챕터당 최소 3개 태그 확보 시 PASS
- **에스컬레이션**: 보강 3회 후에도 0건 → 사용자에게 질의
- **자동 수정**: 가능 — WebSearch 후 태그 삽입

### P11: C4 역매칭 — Feature count + _contract.md 존재
- **대상**: ch03(경쟁 비교), ch04(JTBD), ch05(기능 목록), ch08(GTM)
- **검증**:
  1. C4 Feature Registry에서 전체 기능명+ID 추출
  2. 대상 챕터에서 "O", "제공", "포함", "지원" 등 보유 주장 추출
  3. 각 주장이 C4의 Feature ID에 매핑되는지 확인
- **PASS**: C4 미등록 기능 주장 0건
- **FAIL**: 매핑 불가 항목 존재 또는 v2 기능을 현재 보유로 주장
- **자동 수정**: 부분 가능 — 명확한 매핑 오류는 Feature ID 추가, 애매한 건 사용자 확인

#### P11 예방 메커니즘
1. ch05 작성 시 기능 목록은 context.md + seed.md 범위 내에서만 정의
2. P0/P1은 seed.md 도출 범위, P2/P3 확장 기능은 최대 4개 제한
3. ch05 완료 직후 _contract.md C4 즉시 생성
4. ch06 이후 에이전트 프롬프트에 "C4 Feature ID만 사용, 새 기능 정의 금지" 명시

### P12-A: 중간 월 Peer 대조
- **정본**: ch09 월별 canonical table
- **대상**: ch08(GTM 월별 성장표), ch01(월별 수치 인용)
- **검증**: ch09 M1~M11 수치 → ch08 동일 월 MAU 1:1 대조
- **PASS**: 불일치 0건
- **FAIL**: 중간 월 수치 불일치
- **자동 수정**: 가능 — ch09 기준으로 대상 챕터 수정

### P12-B: 인프라 비용 Canonical Flow
- **정본**: ch06 (유일한 정본)
- **흐름**: `ch06 산출 → _contract.md C7 복사 → ch07/ch01/ch12 인용`
- **검증**: ch06 인프라 총합 → C7 → ch07/ch01/ch12 3-way 대조
- **PASS**: ch06 = C7 = ch07 일치
- **FAIL**: 어느 한 곳이라도 불일치
- **자동 수정**: 가능 — ch06 앵커 → C7 → ch07/ch01/ch12 순차 갱신

### P12-C: 프리미엄 비교표 Peer 대조
- **정본**: ch05 프리미엄 비교표 → _contract.md C3
- **대상**: ch07(플랜 비교), ch01(요약 비교표)
- **검증**: C3 항목/값 셀 단위 추출 → ch07/ch01과 1:1 대조
- **PASS**: C3 = ch07 = ch01 셀 단위 일치
- **FAIL**: 기능 수치 불일치 (예: 무료 5회/일 vs 3회/일)
- **자동 수정**: 가능 — C3 기준으로 덮어쓰기

### P12-D: 페르소나 수치 Peer 대조
- **정본**: ch04 페르소나 프로필
- **대상**: ch07(타겟 지출 패턴), ch08(마케팅 타겟 특성)
- **검증**:
  1. ch04 페르소나 수치(지출액, 연령, 빈도) 추출
  2. ch07/ch08 인용 시 ch04와 대조
  3. 산술 오류 검사 (예: 식비 25만 = 외식 15만 + 장보기 15만 → 15+15=30≠25)
- **PASS**: 불일치 0건 + 산술 오류 0건
- **FAIL**: 수치 불일치 또는 산술 오류
- **자동 수정**: 가능 — ch04 기준으로 수정

### P12-E: 마케팅 예산 Peer 대조
- **정본**: ch08 (유일한 정본)
- **흐름**: `ch08 산출 → ch07/ch01 인용`
- **검증**: ch08 마케팅 총 예산 + 채널별 배분 → ch07/ch01 대조
- **PASS**: ch08 = ch07 = ch01 마케팅 비용 일치
- **FAIL**: 불일치
- **자동 수정**: 가능 — ch08 앵커 → ch07/ch01 갱신

### P13: C2 파생 수치 산술 검증
- **대상**: _contract.md C2, ch09 월별 테이블
- **검증**:
  1. ch09 M1~M12 MRR 합산 (산술 계산)
  2. C2 "Y1 누적 매출"과 대조 (허용 오차 ±5%)
  3. C2 "Y1 평균 MAU"와 ch09 MAU 산술평균 대조 (허용 오차 ±10%)
  4. "run-rate" vs "cumulative" 표기 확인
- **PASS**: 산술 괴리 ±5% 이내 + 표기 명확
- **FAIL**: 오차 5% 초과 또는 미표기
- **자동 수정**: 가능 — ch09 MRR 합산을 정본으로 C2 수정 (파생 수치는 계산이 앵커)

---

## Design Phase 패턴

### P6: UI 목업 플레이스홀더 검사
- **대상**: Design/UX, Presentation
- **검증**: 정규식 `\[[가-힣A-Za-z]+\]`로 스캔 (코드 블록, Feature ID 제외)
- **PASS**: `[버튼]`, `[메뉴]`, `[아이콘]`, `[HP바]` 등 텍스트 플레이스홀더 0건
- **FAIL**: 위반 1건 이상
- **자동 수정**: 불가 — 실제 UI 요소로 교체 필요 (사용자/디자이너 판단)

### P7: API 엔드포인트 커버리지
- **대상**: Design/API
- **검증**: ch05 P0/P1 기능 ID 목록 vs api-endpoints.md 매핑 테이블 대조
- **PASS**: P0 100% + P1 90%+ 커버
- **FAIL**: P0 누락 또는 P1 90% 미만
- **자동 수정**: 부분 가능 — 누락 엔드포인트 스켈레톤 생성, 상세는 수동

### P8: 기술스택 정합성
- **대상**: Design/Infra + Security
- **검증**: ch06 기술 목록(호스팅, DB, 인증, 암호화) vs hosting-decision.md + auth-design.md 대조
- **PASS**: 불일치 0건
- **FAIL**: 기술 선택 불일치
- **자동 수정**: 가능 — ch06 기준으로 설계서 수정

### P9: E2E 테스트 커버리지
- **대상**: Design/QA
- **검증**:
  1. ch05 P0/P1 기능 ID vs e2e-test-scenarios.md 매핑 대조
  2. performance-test-plan.md 성능 기준 vs context.md/ch06 대조
- **PASS**: P0 100% + P1 90%+ 커버
- **FAIL**: P0 누락 또는 P1 90% 미만
- **자동 수정**: 부분 가능 — 누락 시나리오 스켈레톤 생성

### P14: DB 스키마 ↔ API 필드 매칭 (디자인 시스템 일관성)
- **대상**: `design/data/db-schema.md` + `design/api/api-endpoints.md`
- **검증**:
  1. DB 테이블 컬럼명 추출
  2. API request/response body 필드 추출
  3. API 참조 필드가 DB에 존재하는지 대조
- **PASS**: 미정의 필드 0건
- **FAIL**: API가 DB에 없는 필드 반환
- **WARNING**: 타입 불일치 (DB=integer, API=string)
- **자동 수정**: 부분 가능 — 명확한 누락은 DB 스키마에 컬럼 추가

### P15: API 엔드포인트 ↔ 화면 매핑 (도메인 정합성)
- **대상**: `design/ux/screen-mockups.md` + `design/api/api-endpoints.md`
- **검증**:
  1. 화면별 사용자 인터랙션(버튼, 데이터 로드) 추출
  2. 각 인터랙션 → API 엔드포인트 매핑
  3. 화면 필요 but API 미정의 → FAIL
  4. API 정의 but 화면 미호출 → WARNING
- **PASS**: 화면→API 누락 0건
- **FAIL**: 화면에서 필요한 API 미정의
- **자동 수정**: 부분 가능 — 누락 엔드포인트 스켈레톤 생성

### P16: 보안 설계 ↔ API 인증 매칭 (보안-인프라 정합성)
- **대상**: `design/security/auth-design.md` + `design/api/api-endpoints.md`
- **검증**:
  1. auth-design.md에서 인증 방식 + 인가 규칙 추출
  2. api-endpoints.md 각 엔드포인트의 auth 요구사항 추출
  3. 보안 "인증 필수" vs API "public" → FAIL
  4. Rate Limiting 정책 반영 확인
  5. 민감 데이터 엔드포인트 추가 보안 명시 확인
- **PASS**: 인증/인가 불일치 0건
- **FAIL**: 보안 정책과 API auth 불일치
- **자동 수정**: 가능 — auth-design 기준으로 API auth 태그 수정

### P17: 접근성 설계 정합성
- **대상**: `design/ux/accessibility-guide.md` + 도메인 `quality/accessibility-design.md`
- **검증**:
  1. 공통 가이드(WCAG 기준 수준) ↔ 도메인 설계 반영 대조
  2. Fallback: 공통 가이드 부재 시 도메인 문서 단독 검증 (유형별 최소 기준 충족)
     - 게임: 색맹 모드 + 자막 + 조작 리매핑 + 난이도 옵션
     - 모바일: VoiceOver/TalkBack + 다이나믹 타입 + 터치 타겟 48×48
     - 웹 SaaS: WCAG 2.1 AA + 키보드 내비게이션 + 스크린 리더
     - 데스크톱/크롬확장: 키보드 내비게이션 + 고대비
- **PASS**: 공통 기준 ≤ 도메인 기준, 유형별 최소 항목 충족
- **FAIL**: 도메인이 공통보다 낮은 기준, 최소 항목 누락
- **자동 수정**: 부분 가능 — 누락 항목 스켈레톤 추가

### P18: 보안 설계 정합성
- **대상**: `design/security/auth-design.md` + 도메인 보안 문서
- **검증**:
  1. 공통 보안 정책(인증 방식, 토큰 수명, 암호화 수준) ↔ 도메인 문서 반영 대조
  2. auth-design.md 토큰 수명 ↔ api/auth-flow.md 정확히 동일
  3. 유형별 추가: 게임 anti-cheat ↔ multiplayer-arch, API security-hardening ↔ rate-limit
- **PASS**: 공통 보안 정책이 도메인에 동일 반영
- **FAIL**: 불일치 (특히 토큰 수명, 인증 방식)
- **자동 수정**: 가능 — auth-design.md 기준으로 동기화

### P19: 현지화 전략 정합성
- **대상**: 도메인 `quality/localization-strategy.md` + `context.md`
- **검증**: 지원 언어 목록 ↔ context.md 대상 시장 대조
- **PASS**: 대상 시장 언어가 localization-strategy에 포함
- **FAIL**: 대상 시장 언어 누락
- **WARNING**: v1 영어 전용이나 context.md 대상 시장이 비영어권
- **자동 수정**: 부분 가능 — 누락 언어 추가 (번역은 수동)

---

## Implementation Phase 패턴

### P4: A-code/S-code 태그 정확성
- **대상**: Implementation 태스크 파일
- **검증**: 태스크의 [A코드], [S코드] 태그 → context.md Locked Decisions 기술 선택과 대조
- **PASS**: 오태그 0건
- **FAIL**: 태그가 context.md와 불일치
- **자동 수정**: 가능 — context.md 기준으로 태그 수정

### P10: STATE.md 동기화
- **대상**: 모든 Phase 완료 후
- **검증**:
  1. STATE.md Phase 상태(완료/미완료)가 실제 파일 존재와 일치
  2. Locked Decisions가 context.md와 동기화
- **PASS**: 불일치 0건
- **FAIL**: 상태 불일치
- **자동 수정**: 가능 — 실제 파일 기준으로 STATE.md 갱신

### P-NEW-1: 태스크 원자성 검증
- **대상**: Implementation 태스크 파일
- **검증**: 각 태스크가 파일/함수 단위로 쪼개져 있는지 확인
  - "로그인 시스템 구현" → FAIL (너무 광범위)
  - "auth/login.ts — loginWithEmail() 함수 구현" → PASS
- **PASS**: 모든 태스크가 파일/함수 수준
- **FAIL**: 광범위 태스크 존재
- **자동 수정**: 부분 가능 — 광범위 태스크를 하위 태스크로 분할 제안

### P-NEW-2: Feature → Task 커버리지
- **대상**: Implementation 태스크 파일 vs C4 Feature Registry
- **검증**: C4의 F01~Fxx 전체가 태스크에 매핑되는지 확인
  - 각 Feature ID가 최소 1개 태스크에 할당
  - 태스크에 Feature ID 태그 존재
- **PASS**: 미매핑 Feature 0건
- **FAIL**: Feature가 어떤 태스크에도 매핑되지 않음
- **자동 수정**: 부분 가능 — 누락 Feature에 대한 태스크 스켈레톤 생성

---

## Assembly 패턴

### P-ASM-1: 합본 챕터별 라인 수 vs skeleton 최소 기준
- **대상**: `{프로젝트명}-기획서.md` 합본
- **검증**: skeleton.md의 섹션별 목표 라인 수와 합본 실제 라인 수 비교
- **PASS**: 모든 챕터 목표의 80% 이상
- **FAIL**: 어떤 챕터든 80% 미만
- **자동 수정**: 불가 — 내용 보강 필요 (해당 챕터 에이전트 재실행)

### P-ASM-2: 합본 구조 검증
- **대상**: `{프로젝트명}-기획서.md` 합본
- **검증**:
  1. 중복 헤더 검사 (동일 `##` 제목이 2회 이상)
  2. 챕터 순서 검사 (ch01 → ch02 → ... → ch12 순)
  3. 목차 링크 검사 (목차 앵커 → 실제 헤더 존재)
  4. 챕터 간 빈 줄/구분선 일관성
- **PASS**: 중복 0건 + 순서 정상 + 링크 유효
- **FAIL**: 중복 헤더, 순서 역전, 깨진 링크
- **자동 수정**: 가능 — 중복 제거, 순서 정렬, 링크 수정

---

## 정량 구조 검증 (SV — runner.js 코드 레벨)

> v5.4 신규. LLM "판단"이 아닌 **코드 대조/계산**으로 검증.
> `node runner.js --verify {프로젝트명}`으로 실행.
> Verify Phase 실행 시 runner.js가 자동으로 SV 결과를 에이전트 프롬프트에 주입한다.
> SV FAIL 항목은 **확정 FAIL** — LLM이 재판단하지 않고 즉시 수정한다.

### SV1: 필수 파일 존재 + 최소 크기
- **대상**: 핵심 산출물 7개
- **검증**: 파일 존재 + 500B 이상 (빈 파일/스텁 방지)
- **PASS**: 모든 파일 최소 크기 충족
- **FAIL**: 파일 부재 또는 최소 크기 미달

### SV2: Feature 수 일치 (contract C4 vs ch05)
- **검증**: `F\d{2,3}` 정규식으로 양쪽 unique ID 수 추출 → 일치 확인
- **PASS**: 양쪽 Feature ID 수 동일
- **FAIL**: 불일치 (기능 누락 또는 미등록 기능 존재)

### SV3: 수치 교차검증 (contract C2 vs ch09)
- **검증**: MAU, 매출 등 핵심 수치를 정규식으로 추출 → 허용 오차 ±10% 대조
- **PASS**: 오차 10% 이내
- **FAIL**: 오차 초과

### SV4: 마일스톤 수 일치 (ch06 vs implementation/tasks)
- **검증**: `M\d` 또는 `마일스톤 \d` 패턴으로 양쪽 마일스톤 수 추출
- **PASS**: 수 일치
- **FAIL**: 불일치

### SV5: API 엔드포인트 커버리지 (ch05 P0/P1 → api-endpoints)
- **검증**: ch05에서 P0/P1 Feature ID 추출 → api-endpoints.md에서 참조 확인
- **PASS**: 90% 이상 커버
- **FAIL**: 90% 미만

### SV6: 출처 태그 비율 (planning 전체)
- **검증**: `[출처:]` / `[추정:]` 태그 수 카운트 → 비율 계산
- **PASS**: 70% 이상
- **FAIL**: 70% 미만

### SV7: 챕터별 최소 헤딩 수
- **검증**: 각 planning 챕터에 `##` 이상 헤딩 3개 이상
- **PASS**: 모든 챕터 충족
- **FAIL**: 헤딩 3개 미만 챕터 존재 (빈 파일/스텁 의심)

### SV8: 인프라 비용 3-way 대조
- **검증**: ch06 인프라 합계 = contract C7 = ch07 인프라 인용
- **PASS**: 3곳 일치
- **FAIL**: 어느 한 곳 불일치

---

## Phase별 자동 적용 매트릭스

| Phase | LLM 검증 패턴 | 코드 검증 (SV) |
|-------|----------|----------|
| Research | P5 | — |
| Planning (ch01~12) | P1, P2, P3, P5-B, P11, P12-A~E, P13 | — |
| Assembly (합본) | P1, P11, P12-A~E, P13, P-ASM-1, P-ASM-2 | — |
| **Verify Planning** | P1, P2, P3, P5, P11, P12-A~E, P13 | **SV1, SV2, SV3, SV6, SV7, SV8** |
| Design/UX | P6 | — |
| Design/API | P7, P14, P15, P16 | — |
| Design/Infra+Security | P8, P16 | — |
| Design/QA | P9 | — |
| **Verify Design** | P14, P15, P16, P17, P18, P19 (크로스 검증) | **SV1, SV2, SV5** |
| **Verify Implementation** | P1, P4, P-NEW-1, P-NEW-2 | **SV1, SV2, SV4, SV5** |
| Presentation | P1, P2, P3, P6 | — |
| Infographic | P1, P2, P3 | — |
| Build | P10 (STATE 동기화) | — |
| Review | P7, P8, P14, P16 (설계↔구현 매핑) | — |
| QA | P9 (E2E 커버리지) | — |
| Deploy | P10 (STATE 동기화) | — |
| Maintain | P10 (STATE 동기화) | — |
| 모든 Phase 완료 | P10 | SV1~SV8 전체 |

### 검증 2-Layer 아키텍처 (v5.4)

```
Layer 1: runner.js 코드 검증 (SV1~SV8)
  ├── 파일 존재/크기, 정규식 대조, 수치 계산
  ├── 결과: 확정 PASS/FAIL (LLM 재판단 불필요)
  └── Verify Phase 프롬프트에 자동 주입

Layer 2: LLM 에이전트 검증 (P1~P19)
  ├── 내용 품질, 논리 일관성, 맥락 적절성
  ├── SV FAIL 항목은 "즉시 수정" (판단 스킵)
  └── SV PASS 항목에 대해서만 내용 검토
```
