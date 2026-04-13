# MakeSkill

> 아이디어 하나로 기획서 + 설계서 + 개발가이드 + PPT까지 자동 생성하는 Claude Code 스킬

## Product Spec Engine v5.4

**16단계 AI 파이프라인**이 제품/서비스 아이디어를 완전한 문서 패키지로 변환합니다.
사용자는 CEO 역할만 수행 — 핵심 결정(엔진, 언어, 프레임워크)에만 답하면 나머지는 AI가 자율 진행합니다.

### 파이프라인

```
 1. Seed             프로젝트 초기화
 2a. Research        시장/경쟁/기술/사용자 리서치 (4 병렬)
 2b. Discovery       context.md — SSOT 앵커 생성
 3. Skeleton         기획서 뼈대
 4. Planning         기획서 12장 작성 (4단계, 병렬)
 5. Verify           기획서 검증 (P1-P13 + SV1-SV8)
 6. Design           설계서 작성 (UX/Data/API/Security/Domain 병렬)
 7. Verify           설계서 검증 (P6-P19)
 8. Implementation   개발가이드 + 원자 태스크 분해
 9. Verify           구현가이드 검증
10. Presentation     투자자 PPT 슬라이드
11. Infographic      원페이지 인포그래픽
12. Build            빌드 트래커
13. Review           코드 리뷰 체크리스트
14. QA               QA 리포트
15. Deploy           배포 가이드
16. Maintain         운영/유지보수 가이드
```

### 산출물 예시 (rogue-arena 게임 프로젝트)

| 구분 | 파일 수 | 내용 |
|------|---------|------|
| 기획서 | 13 + 합본 | 시장분석~부록 12장 + SSOT 계약서 |
| 설계서 | 77 | UX/Data/API/Security/Infra/QA + 게임 도메인 |
| 구현가이드 | 14 | 296개 원자 태스크 (파일/함수 수준) |
| 검증 리포트 | 3 | Planning/Design/Impl 전수 검증 |
| 발표자료 | 2 | 13슬라이드 + PPT 생성 스크립트 |
| 인포그래픽 | 2 | 단일 HTML + README |
| **합계** | **~120** | **~24,000줄** |

## 설치

**전제**: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 설치 필요

### Windows (PowerShell)
```powershell
iwr -useb https://raw.githubusercontent.com/karnelian/MakeSkill/master/specs-engine/install.ps1 | iex
```

### Mac / Linux
```bash
curl -fsSL https://raw.githubusercontent.com/karnelian/MakeSkill/master/specs-engine/install.sh | bash
```

### 수동 설치
```bash
git clone https://github.com/karnelian/MakeSkill.git
cp -r MakeSkill/specs-engine ~/.claude/specs-engine
cp MakeSkill/specs-engine/commands/*.md ~/.claude/commands/
```

설치 후 아무 프로젝트 폴더에서 Claude Code 실행 → `/product-spec` 또는 `기획서 만들어줘` 입력.

## 사용법

```
"기획서 만들어줘"         → Phase 1(Seed)부터 전체 파이프라인
"rogue-arena 이어서"     → STATE.md 기반 중단점 재개
"상태"                    → 진행 테이블 출력
"검증해줘"                → 현재 Phase 검증
"PPT 만들어줘"            → Presentation Phase
"인포그래픽"              → Infographic Phase
```

## 지원 유형

| 유형 | Domain 템플릿 | S급 결정 항목 |
|------|--------------|--------------|
| 게임 | `game.md` | 엔진, 서버/클라 언어, BM, 렌더링 |
| 웹 SaaS | `web-saas.md` | 프론트 FW, 언어, 백엔드/BaaS, 호스팅, DB |
| 모바일 앱 | `mobile.md` | 프레임워크, 언어, 상태관리, 백엔드 |
| API 서비스 | `api-service.md` | 서버 언어/FW, DB, 호스팅, API 스타일 |
| 크롬 확장 | `chrome-ext.md` | UI FW, 언어, 빌드 도구 |
| 데스크톱 앱 | `desktop.md` | 프레임워크, 언어, 패키징/배포 |

## 운영 모드

- **1인 모드** — S급 결정만 질문, 최소 검증, 완전 자율 진행
- **팀 모드** — 방향성 확인, 전체 검증
- **회사 모드** — Company Profile 기반, 전원 확인

## 프로젝트 구조

```
MakeSkill/
├── README.md
├── product-spec.md              ← 스킬 엔트리포인트
└── specs-engine/                ← 엔진 본체 (53 파일)
    ├── orchestrator.md          ← 파이프라인 정의
    ├── runner.js                ← 코드 검증 (SV1-SV8)
    ├── rules/                   ← 공유 규칙 (6개)
    │   ├── core.md, roles.md, types.md
    │   ├── conventions.md, verify-patterns.md, recovery.md
    └── templates/               ← Phase별 에이전트 프롬프트 (36개)
        ├── seed.md, discovery.md, skeleton.md, impl.md
        ├── research/            (market, competitor, tech, user)
        ├── planning/            (ch02-03, ch04-05, ch06-09, ch10-12-01, assembly)
        ├── verify/              (planning, design, impl, assembly-check)
        ├── design/              (ux, data-api, security-infra-qa, domain/*)
        └── build.md, review.md, qa.md, deploy.md, maintain.md
```

## 핵심 원칙

1. **사용자 = CEO** — S급 결정만 질문, 나머지 자율 진행
2. **병렬 우선** — 독립 작업은 반드시 병렬 에이전트 실행
3. **자동 검증** — Phase 완료 후 자동 검증, FAIL 시 자동 수정 (최대 3회)
4. **SSOT** — `_contract.md` 기반 단일 진실 소스, 문서 간 수치 100% 일관
5. **STATE.md 재개** — 언제든 중단 후 이어서 진행 가능

## 라이선스

MIT
