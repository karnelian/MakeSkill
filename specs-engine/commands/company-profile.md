---
name: company-profile
description: "회사/스튜디오 프로필 설정. 회사 모드에서 모든 기획서/설계서의 기준이 되는 앵커 파일. 생성/수정/조회."
version: "1.0.0"
author: "STOIC"
tools: [claude-code, cursor, codex, gemini-cli]
---

# Company Profile Manager

회사/스튜디오의 핵심 정보를 설정하는 스킬.
이 파일(`~/.claude/commands/company-profile-data.md`)이 세팅되면,
`/product-spec` 회사 모드에서 **모든 산출물이 이 기준을 따른다**.

---

## 저장 위치

`C:\Users\STOIC\.claude\company-profile-data.md`

- 글로벌 위치 → 모든 프로젝트에서 자동 참조
- 회사/스튜디오 바뀌면 이 파일만 교체
- 여러 회사 프로필을 관리하려면 `company-profile-{회사명}.md`로 백업 후 교체

---

## 사용법

| 명령 | 동작 |
|------|------|
| `/company-profile` | 현재 프로필 조회. 없으면 생성 시작 |
| `/company-profile 생성` | 새 프로필 생성 (질문으로 수집) |
| `/company-profile 수정` | 기존 프로필 특정 항목 수정 |
| `/company-profile 조회` | 현재 프로필 전체 출력 |

---

## 프로세스: 생성

### Step 1: 기본 정보 수집

AskUserQuestion으로 한 번에 수집:

1. **회사명** — 정식 명칭
2. **한줄 미션** — "우리는 ~을 만든다"
3. **주력 분야** — 게임/SaaS/모바일/API/확장/데스크톱 (복수 가능)

### Step 2: 브랜드 & 크리에이티브 방향

AskUserQuestion으로 수집:

1. **톤앤매너** — 유쾌/진지/전문적/친근/도발적/미니멀
2. **아트 스타일 방향** — 픽셀아트/카툰/리얼리스틱/미니멀/로우폴리/해당없음
3. **컬러 톤** — 밝고 화려한/차분한/다크/모노톤/브랜드 컬러 지정
4. **사운드 방향** — 칩튠/오케스트라/일렉트로닉/미니멀/해당없음

### Step 3: 비즈니스 철학

AskUserQuestion으로 수집:

1. **수익 모델 선호** — IAP 중심 / 광고 중심 / 프리미엄(유료) / 구독 / 자유
2. **광고 정책** — 적극 활용 / 최소한 / 절대 안 씀
3. **가격 철학** — 저가 대량 / 중가 밸런스 / 프리미엄
4. **타겟 철학** — 코어 유저 집중 / 캐주얼 대중 / 니치 마켓

### Step 4: 개발 기준

AskUserQuestion으로 수집:

1. **품질 기준** — 완성도 최우선 / 빠른 출시 후 개선 / 밸런스
2. **기술 선호** — 특정 엔진/프레임워크 선호 (있으면 명시)
3. **팀 규모** — 1인 / 2~5명 / 5~20명 / 20명+
4. **아트/사운드 리소스 전략** — AI 생성 적극 활용 / 외주 / 자체 제작 / 에셋스토어

### Step 5: company-profile-data.md 생성

```markdown
# Company Profile

> 최종 수정: {날짜}

## 기본 정보
- 회사명: {회사명}
- 미션: "{미션}"
- 주력 분야: {분야}

## 브랜드 & 크리에이티브
- 톤앤매너: {톤}
- 아트 스타일: {스타일}
- 컬러 톤: {컬러}
- 사운드 방향: {사운드}

## 비즈니스 철학
- 수익 모델: {모델}
- 광고 정책: {정책}
- 가격 철학: {가격}
- 타겟 철학: {타겟}

## 개발 기준
- 품질 기준: {기준}
- 기술 선호: {기술}
- 팀 규모: {규모}
- 리소스 전략: {전략}

## 커스텀 규칙
(사용자가 자유롭게 추가하는 영역)
- 예: "모든 캐릭터는 동물 모티브"
- 예: "UI는 항상 다크 모드 우선"
- 예: "한국어/영어 동시 지원 필수"
```

---

## 프로세스: 수정

1. 기존 `company-profile-data.md` 읽기
2. 사용자에게 "어떤 항목을 수정할까요?" 질문
3. 해당 항목만 AskUserQuestion으로 재수집
4. 파일 업데이트

---

## 프로세스: 조회

1. `company-profile-data.md` 읽기
2. 없으면: "Company Profile이 없습니다. `/company-profile 생성`으로 만드세요."
3. 있으면: 전체 내용 출력

---

## 다른 스킬에서 참조하는 방법

`/product-spec` (specs-engine v5.4) 에서:

```
회사 모드 선택 시:
1. ~/.claude/company-profile-data.md 읽기
2. 없으면 → "/company-profile 생성을 먼저 실행하세요" 안내 후 중단
3. 있으면 → 프로필 내용을 context.md에 포함
4. 이후 모든 Phase에서 이 기준 참조
```

---

## 활용 예시

| Phase | Company Profile 반영 |
|-------|---------------------|
| Phase 1 (Seed) | 유형 + 타겟 철학 자동 반영 |
| Phase 2a (Research) | 회사 주력 분야 기반 리서치 포커스 |
| Phase 2b (Discovery) | S급 결정 시 회사 철학과 충돌 검사 |
| Phase 4 (Planning ch04-05) | 타겟 철학 기반 페르소나 |
| Phase 4 (Planning ch07-09) | 수익/가격 철학 기반 BM 설계 |
| Phase 6 (Design UX) | 톤앤매너/컬러 톤 반영 |
| Phase 6 (Design Domain) | 아트/사운드 방향 반영 |

$ARGUMENTS