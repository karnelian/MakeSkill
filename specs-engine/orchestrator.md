# Product Spec Orchestrator v5.4

사용자 아이디어를 받아 기획서 + 설계서 + 개발가이드까지 자동 생성하는 **오케스트레이터**.
이 파일이 유일한 스킬 — 나머지는 templates/와 rules/에서 읽어서 에이전트에게 전달한다.

---

## 실행 원칙

1. **사용자 = CEO** — S급 결정만 질문, 나머지 자율 진행
2. **병렬 우선** — 의존성 없는 작업은 반드시 병렬 에이전트로 실행
3. **템플릿 기반** — 에이전트 프롬프트는 templates/에서 읽어 구성
4. **규칙 분리** — 공통 규칙은 rules/에서 읽어 에이전트에 주입
5. **2-Layer 검증** — 코드 정량 검증(SV) + LLM 내용 검증(P) 이중 체크
6. **게이트 제어** — 기획/설계 영역과 실행 영역을 게이트로 분리

---

## 디렉토리 구조

```
specs-engine/
├── orchestrator.md          ← 이 파일 (유일한 스킬)
├── runner.js                ← Phase 게이트 + 정량 검증 + 프롬프트 빌더
├── rules/                   ← 공유 규칙 (에이전트에 주입)
│   ├── core.md              ← 공통 규칙 (~80줄)
│   ├── roles.md             ← 역할 시스템 v5.4.1 (300+역할, 3-Tier 소환)
│   ├── types.md             ← 유형 정의 + 유형별 카테고리 (~120줄)
│   ├── conventions.md       ← WebSearch/출처/이터레이션 (~60줄)
│   ├── verify-patterns.md   ← 검증 패턴 P1~P19 + SV1~SV8 정의 (~450줄)
│   └── recovery.md          ← 에러 복구 규칙 F1~F5 (~120줄)
└── templates/               ← 에이전트 프롬프트 템플릿
    ├── seed.md              ← Phase 1: 아이디어 → 인텐트 추출
    ├── research/            ← Phase 2a: 4개 병렬 리서치
    │   ├── market.md
    │   ├── competitor.md
    │   ├── tech.md
    │   └── user.md
    ├── discovery.md         ← Phase 2b: 리서치 종합 → context.md
    ├── skeleton.md          ← Phase 3: 전체 목차 설계
    ├── planning/            ← Phase 4: 기획서 작성
    │   ├── ch02-03.md       ← 시장분석 + 경쟁사분석
    │   ├── ch04-05-contract.md ← 사용자분석 + 제품정의 + _contract.md
    │   ├── ch06.md          ← 기술개요 (단독 — ch07/ch08의 선행 의존)
    │   ├── ch07.md          ← 비즈니스모델 (ch06 의존)
    │   ├── ch08.md          ← GTM 전략 (ch05 의존)
    │   ├── ch09.md          ← KPI/성과지표 (ch07+ch08 의존)
    │   ├── ch10-12-01.md    ← 로드맵 + 리스크 + 부록 + Executive Summary
    │   └── assembly.md      ← 합본 + 분량 검증
    ├── verify/              ← Phase 5/7/9: 검증
    │   ├── planning.md
    │   ├── assembly-check.md
    │   ├── design.md
    │   └── impl.md
    ├── design/              ← Phase 6: 설계서
    │   ├── ux.md
    │   ├── data-api.md
    │   ├── security-infra-qa.md
    │   └── domain/{game,web-saas,mobile,desktop,chrome-ext,api-service}.md
    ├── impl/                ← Phase 8: 개발가이드 (3 병렬)
    │   ├── dev-env.md       ← 개발환경 + 컨벤션 + 폴더구조
    │   ├── tasks.md         ← 마일스톤 + 태스크 분해
    │   └── checklists.md    ← 사전/사후 체크리스트
    ├── presentation.md      ← Phase 10: PPT (선택)
    ├── infographic.md       ← Phase 11: 인포그래픽 (선택)
    ├── build.md             ← Phase 12: 빌드 실행
    ├── review.md            ← Phase 13: 코드 리뷰
    ├── qa.md                ← Phase 14: QA 실행
    ├── deploy.md            ← Phase 15: 배포
    ├── maintain.md          ← Phase 16: 운영/유지보수
    ├── update.md            ← 부분 수정 (선택)
    └── migrate.md           ← 버전 마이그레이션 (선택)
```

---

## 에이전트 병렬 맵 (v5.4)

> 총 에이전트 수: 단일 실행 시 최소 15개 에이전트 (v5.3: 11개 → v5.4: 15개)

```
Phase 1:   Seed                 [1 에이전트]
Phase 2a:  Research              [4 병렬] market / competitor / tech / user
Phase 2b:  Discovery             [1 에이전트]
Phase 3:   Skeleton              [1 에이전트]
Phase 4-1: Planning (Ch02-03 + Ch04-05)  [2 병렬]
Phase 4-2a: Planning (Ch06)      [1 에이전트] ← ch07/ch08의 선행 의존
Phase 4-2b: Planning (Ch07 + Ch08)  [2 병렬] ← ch06 완료 후
Phase 4-2c: Planning (Ch09)      [1 에이전트] ← ch07/ch08 완료 후
Phase 4-3: Planning (Ch10-12+01) [1 에이전트]
Phase 4-4: Assembly              [1 에이전트]
Phase 5:   Verify Planning       [1 에이전트] + runner.js SV 코드 검증
Phase 6a:  Design (UX + Data-API)   [2 병렬]
Phase 6b:  Design (Sec-Infra-QA + Domain)  [2 병렬] ← 6a의 api-endpoints 의존
Phase 7:   Verify Design         [1 에이전트] + runner.js SV 코드 검증
Phase 8:   Implementation        [3 병렬] dev-env / tasks / checklists
Phase 9:   Verify Implementation [1 에이전트] + runner.js SV 코드 검증
Phase 10:  Presentation          [1 에이전트] [선택]
Phase 11:  Infographic           [1 에이전트] [선택]
                                 ━━━ GATE: spec-complete ━━━
Phase 12:  Build                 [1 에이전트] 🛠️ 실행 영역
Phase 13:  Review                [1 에이전트] 🛠️
Phase 14:  QA                    [1 에이전트] 🛠️
Phase 15:  Deploy                [1 에이전트] 🛠️
Phase 16:  Maintain              [1 에이전트] 🛠️
```

### 3-Tier 역할 소환 시스템 (v5.4.1)

> 역할 300+명 전체가 매번 토론하면 컨텍스트 낭비.
> runner.js가 `ROLE_TIERS`를 통해 T1 핵심팀(항상) + T2 전문가(키워드 매칭) 자동 주입.
> T3 전체 조직도는 roles.md에서 딥다이브 시 수동 참조.

```
T1 핵심팀 (5~8명) ─── 항상 프롬프트 주입
     │
     ├── 섹션 키워드 매칭 ──→ T2 전문가 자동 소환 (0~10명 추가)
     │   예: "전투 밸런스" → 전투 기획자 + 밸런스 기획자
     │
     └── 수동 딥다이브 ────→ T3 roles.md 전체 조직도 참조
```

### 유형별 에이전트 할당 (v5.4 — 동적)

프로젝트 유형(`context.md §1`)에 따라 에이전트 구성이 자동 조정된다:

| Phase | 게임 | 웹 SaaS | 모바일 앱 | API 서비스 | 크롬 확장 |
|-------|------|---------|----------|-----------|----------|
| Design 6a | UX + Data-API | UX + Data-API | UX + Data-API | Data-API only | UX + Data-API |
| Design 6b | Sec-Infra-QA + **game.md** | Sec-Infra-QA + **web-saas.md** | Sec-Infra-QA + **mobile.md** | Sec-Infra-QA + **api-service.md** | Sec-Infra-QA + **chrome-ext.md** |
| Design 6b 산출물 | game-design/, sound/, art/, narrative/, level-design/ | growth/, quality/ | quality/, platform/ | quality/ | quality/ |
| Impl 병렬 수 | 3 (dev-env + tasks + checklists) | 3 | 3 | 2 (checklists 간소화) | 2 |

---

## 파이프라인 실행 플로우

### Phase 1: Seed
```
읽기: (없음, 최초)
실행: templates/seed.md → 단일 에이전트
산출: specs/{name}/seed.md, STATE.md
S급: 아이디어 확인, 운영 모드, 기술 스택
```

### Phase 2a: Research (4 병렬)
```
읽기: seed.md
실행: templates/research/*.md → 4개 병렬 에이전트
산출: specs/{name}/research/{market,competitor,tech,user}.md
주입: rules/conventions.md (WebSearch/출처 규칙)
```

### Phase 2b: Discovery
```
읽기: seed.md + research/*.md (4개)
실행: templates/discovery.md → 단일 에이전트
산출: specs/{name}/context.md
주입: rules/roles.md + rules/types.md
핵심: Locked Decisions, SSOT 수치, Gray Areas 확정
```

### Phase 3: Skeleton
```
읽기: seed.md + context.md
실행: templates/skeleton.md → 단일 에이전트
산출: specs/{name}/skeleton.md
S급: 목차 구조 확인 (사용자 확인 필요 시에만)
```

### Phase 4: Planning (5단계)
```
1단계 (2 병렬):
  - templates/planning/ch02-03.md → ch02, ch03
  - templates/planning/ch04-05-contract.md → ch04, ch05, _contract.md
  주입: rules/conventions.md + rules/roles.md

2a단계 (단독):
  - templates/planning/ch06.md → ch06
  의존: _contract.md (C1~C6), ch05 (기능 목록)
  완료 후: _contract.md C7 갱신

2b단계 (2 병렬):
  - templates/planning/ch07.md → ch07
  - templates/planning/ch08.md → ch08
  의존: ch06 (인프라 비용), ch05 (기능), ch04 (페르소나)

2c단계 (단독):
  - templates/planning/ch09.md → ch09
  의존: ch07 (BM 수치), ch08 (GTM 수치)

3단계:
  - templates/planning/ch10-12-01.md → ch10, ch11, ch12, ch01
  의존: ch06~ch09 완료

4단계:
  - templates/planning/assembly.md → 합본
  - templates/verify/assembly-check.md → 분량 검증
  의존: ch01~ch12 + _contract.md
```

### Phase 5: Verify (기획서) — 2-Layer 검증
```
Layer 1 (코드): runner.js verifyStructure() 자동 실행
  → SV1(파일), SV2(Feature수), SV3(수치), SV6(출처), SV7(헤딩), SV8(인프라비용)
  → FAIL 항목을 에이전트 프롬프트에 주입

Layer 2 (LLM): templates/verify/planning.md → 단일 에이전트
  → SV FAIL 항목: 즉시 수정 (재판단 불필요)
  → SV PASS 항목: P1, P2, P3, P5, P11, P12-A~E, P13으로 내용 검증
  주입: rules/verify-patterns.md

FAIL 시: 자동 수정 → 재검증 (최대 3회)
합본 재생성 필요 시: templates/planning/assembly.md 재실행
```

### Phase 6: Design (2단계 병렬)
```
유형 판별: context.md에서 유형 읽기 → 해당 domain 템플릿 선택

6a단계 (2 병렬):
  - templates/design/ux.md → design/ux/*.md
  - templates/design/data-api.md → design/data/*.md + design/api/*.md

6b단계 (2 병렬) — 6a 완료 후:
  - templates/design/security-infra-qa.md → design/security/*.md + design/infra/*.md + design/qa/*.md
  - templates/design/domain/{유형}.md → design/{유형별}/*.md
  의존: design/api/api-endpoints.md, design/api/auth-flow.md (6a 산출)

주입: rules/roles.md (유형별 전문가)
```

### Phase 7: Verify (설계서) — 2-Layer 검증
```
Layer 1 (코드): SV1, SV2, SV5 자동 검증
Layer 2 (LLM): templates/verify/design.md → 단일 에이전트
주입: rules/verify-patterns.md (P6~P19)
```

### Phase 8: Implementation (3 병렬)
```
읽기: context.md + ch05 + ch06 + ch10 + design/**

3 병렬 에이전트:
  - templates/impl/dev-env.md → dev-guide.md + folder-structure.md
  - templates/impl/tasks.md → tasks/milestone-overview.md + M1~M4 + post-launch.md
  - templates/impl/checklists.md → checklists/pre-development.md + pre-launch.md + post-launch.md + game-checklist.md

산출: implementation/*.md
```

### Phase 9: Verify (구현) — 2-Layer 검증
```
Layer 1 (코드): SV1, SV2, SV4, SV5 자동 검증
Layer 2 (LLM): templates/verify/impl.md → 단일 에이전트
주입: rules/verify-patterns.md (P4, P-NEW-1, P-NEW-2)
```

### Phase 10: Presentation (선택)
```
기획서 기반 발표자료. 사용자 요청 시 실행.
실행: templates/presentation.md → 단일 에이전트
```

### Phase 11: Infographic (선택)
```
기획서 기반 인포그래픽. 사용자 요청 시 실행.
실행: templates/infographic.md → 단일 에이전트
```

### ━━━ GATE: spec-complete ━━━

```
Phase 11 완료 (또는 Phase 9 완료 + PPT/인포그래픽 스킵) 시 자동 멈춤.
STATE.md에 "gate: spec-complete" 마커 기록.

사용자에게 안내:
  "기획서 + 설계서 + 개발가이드(+ 발표자료)가 모두 완료되었습니다.
   실제 개발(빌드)을 시작하려면 '빌드해줘'라고 입력하세요."

PPT/인포그래픽은 게이트 앞에 위치 — 기획 산출물의 일부.
Phase 12 이후만 사용자 명시 요청으로 진행.
```

### Phase 12~16: Build → Review → QA → Deploy → Maintain
```
🛠️ 실행 영역. 사용자 요청 시에만 진행.
순차 실행:
  - templates/build.md → 태스크 실행 관리
  - templates/review.md → 코드 리뷰
  - templates/qa.md → QA 실행
  - templates/deploy.md → 배포
  - templates/maintain.md → 운영/유지보수
```

### Update (선택 — 부분 수정)
```
기존 기획서/설계서를 부분적으로 수정할 때 사용.
기능 추가/삭제, 가격 변경, 기술 변경, 타겟 변경에 대응.
읽기: context.md + _contract.md + 변경 유형에 따라 관련 문서
실행: templates/update.md → 단일 에이전트
핵심: 영향 범위 분석 → 높음→낮음 순서로 갱신 → SSOT 교차검증
```

### Migrate (선택 — 버전 마이그레이션)
```
스킬/템플릿 버전 업그레이드 시 기존 프로젝트를 새 규칙에 맞게 일괄 업데이트.
읽기: specs/ 전체 프로젝트 STATE.md
실행: templates/migrate.md → 단일 에이전트
핵심: 마이그레이션 레지스트리 기반 → 일괄 수정 → verify 재검증
```

---

## 에이전트 프롬프트 구성법

각 에이전트를 실행할 때 다음 순서로 프롬프트를 구성:

```
1. 해당 templates/{phase}.md 파일 내용을 읽는다
2. 필요한 rules/*.md 파일 내용을 읽는다
3. 프로젝트 변수를 치환한다:
   - {프로젝트명} → specs/ 하위 디렉토리명
   - {유형} → context.md에서 읽은 유형
   - {운영모드} → seed.md에서 읽은 모드
4. Verify Phase인 경우: runner.js verifyStructure() 결과를 주입
5. 결합하여 Agent tool의 prompt 파라미터로 전달한다
```

실제 코드 패턴:
```
1. Read templates/planning/ch04-05-contract.md → template_content
2. Read rules/conventions.md → conventions
3. Agent prompt = template_content + "\n\n## 공통 규칙\n" + conventions
```

유형별 컨텍스트 주입 패턴 (v5.4):
```
1. context.md에서 유형 판별 → "game"
2. ROLE_MAP["game"]["data-api.md"] → "게임서버/네트워크 설계자"
3. 프롬프트 상단에 주입:
   "유형: 게임
    당신의 역할: 게임서버/네트워크 설계자
    '백엔드' → '게임 서버'
    'API' → '클라이언트-서버 프로토콜'
    '보안' → '안티치트 + 서버 권위'"
4. 동일한 data-api.md 템플릿이지만, 에이전트는 게임 관점으로 실행
```

Verify Phase 코드 패턴:
```
1. node runner.js --verify {프로젝트명} → SV 결과 (JSON/텍스트)
2. SV FAIL 항목을 "확정 FAIL" 섹션으로 프롬프트에 주입
3. LLM 에이전트는 SV FAIL 항목을 즉시 수정 + 나머지 P 패턴 검증
```

---

## 프리컨디션 체크 (Phase 게이트 진입 전 필수)

각 Phase 실행 전 반드시 수행하는 사전 검증:

```
1. 템플릿의 "읽어야 할 파일" 테이블에서 🔴 파일 목록 추출
2. 각 🔴 파일의 존재 여부 확인 (Glob/Read)
3. 🔴 파일 부재 시:
   - "부재 시 행동" 컬럼의 지시에 따라 BLOCK 또는 이전 Phase 복귀
   - 절대 금지: 빈 파일 생성, 파일 없이 추측 작성, BLOCK 무시
4. 🟡 파일 부재 시:
   - DEGRADE 모드로 진행 가능
   - Phase 완료 리포트에 "DEGRADE: {파일명} 부재로 {영향}" 기록
5. 모든 🔴 파일 존재 확인 후 에이전트 실행
```

---

## 에러 복구 (rules/recovery.md 참조)

Phase 실행 중 장애 발생 시:

```
1. 장애 유형 판별 (F1~F5 — rules/recovery.md 참조)
2. 해당 복구 프로토콜 실행
3. STATE.md 복구 로그에 기록
4. F3(검증 반복 실패) 시 사용자 에스컬레이션
5. 복구 완료 후 해당 Phase 재실행 또는 이전 Phase 복귀
```

---

## 상태 관리

### STATE.md 자동 업데이트
각 Phase 완료 시 STATE.md를 자동 업데이트:
- Phase 상태: ⬜ → ✅
- 문서 수 카운트
- Locked Decisions 동기화
- 검증 결과 기록
- **게이트 마커**: spec-complete 도달 시 gate 필드 추가

### Phase 게이트
다음 Phase로 넘어가기 전 자동 체크:
- 이전 Phase 산출물 존재 확인
- 검증 PASS 여부 (기획서/설계서)
- S급 결정 미해결 블로커 확인
- **게이트 체크**: spec-complete 게이트 도달 시 자동 멈춤 → 사용자 명시 요청 대기

---

## 운영 모드별 차이

| 항목 | 1인 모드 | 팀 모드 | 회사 모드 |
|------|---------|--------|----------|
| 질문 횟수 | S급만 (최소) | S급 + 방향성 | 전체 확인 |
| 검증 강도 | SV + 핵심 4패턴 | SV + 전체 20패턴 | SV + 20패턴 + Company Profile |
| 출처 기준 | 70% | 80% | 90% |
| 이터레이션 | 1회 | 2회 | 3회 |
| UAT | 생략 | 핵심만 | 전체 워크스루 |

---

## Phase 완료 리포트 형식

매 Phase 완료 시 사용자에게 출력:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase {N}: {이름} 완료
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
산출물: {파일 수}개 ({총 라인}줄)
에이전트: {사용 에이전트 수}개 ({병렬/순차})
검증: {PASS/FAIL} (SV: {n}/{m} + P: {n}/{m})
결정: {주요 결정 요약}
다음: Phase {N+1} 자동 진행
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## v5.3 → v5.4 변경 사항

| 항목 | v5.3 | v5.4 |
|------|------|------|
| Planning 4-2 | ch06-09 단일 에이전트 | ch06 단독 → ch07+ch08 병렬 → ch09 단독 (3단계) |
| Design | 3+1 병렬 (실질 2+1+1) | 2단계: 6a(UX+DataAPI) 병렬 → 6b(SecInfraQA+Domain) 병렬 |
| Implementation | 단일 에이전트 | 3 병렬 (dev-env / tasks / checklists) |
| 검증 | LLM만 (P 패턴) | **2-Layer**: runner.js SV 코드 검증 + LLM P 패턴 |
| 게이트 | 없음 (자동 진행) | **spec-complete 게이트** (Phase 9 후 자동 멈춤) |
| runner.js | 프리컨디션 + 프롬프트 빌더 | + `--verify` 정량 검증 + SV 결과 프롬프트 주입 |
| 에이전트 병렬 맵 | orchestrator.md에 없음 | **전체 병렬 맵 + 유형별 동적 할당 테이블** 추가 |
| 에이전트 수 (최소) | ~11개 | ~15개 |
| Phase 완료 리포트 | 기본 | 에이전트 수 + 검증 2-Layer 결과 추가 |

## v5.2 → v5.3 변경 사항

| 항목 | v5.2 | v5.3 |
|------|------|------|
| `getProjectType()` | 영문 regex만, 한글 유형명 미지원 | 영문+한글 듀얼 매칭 (typeMap 변환) |
| discovery.md context.md | `§1 프로젝트 기본 정보` 섹션 없음 | `§1` 테이블 추가 (유형 필드 명시) |
| seed.md STATE.md | 12 Phase (Verify/Infographic 누락) | 15 Phase 전체 포함 |
| core.md Phase 번호 | Implementation=7, Presentation=8 (오류) | Implementation=8, Presentation=10 (정정) |
| verify-patterns.md | P1~P16 (17개) | P17(접근성)+P18(보안)+P19(현지화) 추가 (20개) |
| verify-patterns.md 매트릭스 | Design까지만 | Build/Review/QA/Deploy/Maintain 추가 |
| runner.js preconditions | QA/Build/Review/Deploy 불완전 | 템플릿 BLOCK 요구사항과 동기화 |
| runner.js dead code | `getCompletedPhases()` 미사용 | 제거 |

## v5.0 → v5.1 변경 사항

| 항목 | v5.0 | v5.1 |
|------|------|------|
| Planning 템플릿 | 6개 (ch04-05 + contract + ch06 + ch07-09 별도) | 4개 (ch04-05-contract 병합, ch06-09 병합) |
| Phase 4 단계 | 5단계 (contract 별도) | 4단계 (contract가 ch04-05에 통합) |
| 후반 Phase | 없음 | build, review, qa, deploy, maintain 추가 |
| 인포그래픽 | 없음 | infographic.md 추가 |
| v4 스킬 | 31개 병존 | _skills_archive/로 아카이빙 |

---

## 사용법

```
사용자: "기획서 만들어줘" / "product spec" / "/product-spec"
→ Phase 1(Seed)부터 시작

사용자: "Void Breaker 기획서" (기존 프로젝트)
→ STATE.md 읽어서 이어서 진행

사용자: "검증해줘" / "verify"
→ 현재 Phase에 맞는 검증 실행

사용자: "PPT 만들어줘"
→ Phase 10(Presentation) 직행

사용자: "인포그래픽 만들어줘"
→ Phase 11(Infographic) 직행

사용자: "빌드해줘" / "실행해줘" / "배포까지"
→ Phase 12(Build)부터 실행 영역 진행

사용자: "상태" / "status"
→ node runner.js --status {프로젝트명}

사용자: "구조 검증" / "정량 검증"
→ node runner.js --verify {프로젝트명}
```
