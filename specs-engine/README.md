# specs-engine v5.4

AI 전문가 팀이 제품 기획서 + 설계서 + 개발가이드를 자동 생성하는 엔진.

## 구조

```
specs-engine/                          (45파일, ~5,000줄)
├── orchestrator.md                    ← 단일 오케스트레이터 (엔트리포인트)
├── runner.js                          ← Phase 게이트 + 프롬프트 빌더
├── README.md
├── rules/                             ← 공유 규칙 (6개)
│   ├── core.md              작성 규칙, 금지 패턴, SSOT 3원칙
│   ├── roles.md             에이전트 역할 정의
│   ├── types.md             프로젝트 유형별 분기
│   ├── conventions.md       네이밍/포맷 규약
│   ├── verify-patterns.md   검증 패턴 (P1~P19, P-NEW, P-ASM)
│   └── recovery.md          오류 복구 절차
└── templates/                         ← 에이전트 프롬프트 (36개)
    ├── seed.md              Phase 1  — 프로젝트 초기화
    ├── research/            Phase 2a — 시장/경쟁/기술/사용자 리서치 (4 병렬)
    │   ├── market.md, competitor.md, tech.md, user.md
    ├── discovery.md         Phase 2b — context.md 생성
    ├── skeleton.md          Phase 3  — 기획서 뼈대
    ├── planning/            Phase 4  — 기획서 챕터 작성
    │   ├── ch02-03.md           4-1 (+ ch04-05-contract.md 병렬)
    │   ├── ch04-05-contract.md  4-1
    │   ├── ch06-09.md           4-2
    │   ├── ch10-12-01.md        4-3
    │   └── assembly.md          4-4 기획서 조립 (postVerify: assembly-check)
    ├── verify/              Phase 5,7,9 — 검증
    │   ├── planning.md, assembly-check.md, design.md, impl.md
    ├── design/              Phase 6  — 설계 (3 병렬 + Domain)
    │   ├── ux.md, data-api.md, security-infra-qa.md
    │   └── domain/          context.md 유형별 자동 선택
    │       ├── game.md, web-saas.md, mobile.md
    │       ├── desktop.md, chrome-ext.md, api-service.md
    ├── impl.md              Phase 8  — 구현 가이드
    ├── presentation.md      Phase 10 — PPT [선택]
    ├── infographic.md       Phase 11 — 인포그래픽 [선택]
    ├── build.md             Phase 12
    ├── review.md            Phase 13
    ├── qa.md                Phase 14
    ├── deploy.md            Phase 15
    ├── maintain.md          Phase 16
    ├── update.md            부가 — 부분 수정 [선택]
    └── migrate.md           부가 — 버전 마이그레이션 [선택]
```

## 설치

전제: `git`이 설치되어 있어야 합니다.

### 방법 1: 원라이너 (권장)

**Windows (PowerShell):**
```powershell
iwr -useb https://raw.githubusercontent.com/karnelian/MakeSkill/master/install.ps1 | iex
```

**Mac / Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/karnelian/MakeSkill/master/install.sh | bash
```

### 방법 2: 더블클릭 (Windows)

[install.bat](https://github.com/karnelian/MakeSkill/raw/master/install.bat) 다운로드 후 더블클릭

### 방법 3: 수동

```bash
git clone https://github.com/karnelian/MakeSkill ~/.claude/specs-engine
bash ~/.claude/specs-engine/setup.sh         # Mac/Linux
# 또는
powershell -File %USERPROFILE%\.claude\specs-engine\setup.ps1   # Windows
```

### 설치되는 것
- `~/.claude/specs-engine/` — 엔진 본체 (orchestrator, rules, templates)
- `~/.claude/commands/product-spec.md` — `/product-spec` 슬래시 커맨드
- `~/.claude/commands/company-profile.md` — `/company-profile` 슬래시 커맨드

설치 후 **아무 프로젝트 폴더**에서 Claude Code를 실행하고 `/product-spec` 또는 "기획서 만들어줘"라고 입력하면 동작합니다.

### 업데이트
```bash
cd ~/.claude/specs-engine && git pull && bash setup.sh
```

## 사용법

### 자연어 (Claude Code)
```
"기획서 만들어줘" → Phase 1(Seed)부터 전체 파이프라인
"VoiceForge 이어서" → STATE.md 읽어서 중단점부터 재개
"검증해줘" → 현재 Phase 검증
"PPT 만들어줘" → Presentation Phase
```

### runner.js (Phase 게이트 자동화)
```bash
node specs-engine/runner.js --phases                    # Phase 목록
node specs-engine/runner.js --status void-breaker       # 프리컨디션 상태 확인
node specs-engine/runner.js void-breaker design         # Design Phase 프롬프트 생성
```

## 지원 프로젝트 유형

| 유형 | Domain 템플릿 | S급 결정 항목 |
|------|--------------|--------------|
| 게임 | `game.md` | 엔진, 서버/클라이언트 언어, 비즈니스 모델, 렌더링 |
| 웹 SaaS | `web-saas.md` | 프론트엔드 FW, 언어, 백엔드/BaaS, 호스팅, DB |
| 모바일 앱 | `mobile.md` | 프레임워크, 언어, 상태관리, 백엔드/BaaS |
| API 서비스 | `api-service.md` | 서버 언어/FW, DB, 호스팅, API 스타일 |
| 크롬 확장 | `chrome-ext.md` | UI FW, 언어, 빌드 도구 |
| 데스크톱 앱 | `desktop.md` | 프레임워크, 언어, 패키징/배포 |

## 운영 모드

- **1인 모드**: S급 결정만 질문, 최소 검증
- **팀 모드**: 방향성 확인, 전체 검증
- **회사 모드**: Company Profile 기반, 전원 확인
