# product-spec 스킬 소개

> **한 줄 요약**: 아이디어만 던지면 AI 전문가 팀이 기획서 → 설계서 → 개발가이드 → PPT까지 자동으로 만들어주는 올인원 스킬입니다.

---

## 무엇을 하는 스킬인가요?

`product-spec`은 제품/서비스 아이디어를 입력받아 **16단계 파이프라인**을 통해 완전한 제품 문서 패키지를 자동 생성합니다.

사용자는 **CEO 역할**만 수행합니다. 엔진/언어/프레임워크 같은 S급 결정에만 답하면, 나머지는 AI가 자율적으로 진행합니다.

**버전**: v5.4
**엔진 위치**: `~/.claude/specs-engine/`
**엔트리포인트**: `~/.claude/specs-engine/orchestrator.md`

---

## 트리거 키워드

자연어로 다음과 같이 입력하면 자동 실행됩니다.

- `기획서`, `사업계획서`, `PRD`
- `제품 기획`, `서비스 기획`, `프로젝트 기획`
- `기획서 만들어줘`
- `/product-spec` 슬래시 커맨드

---

## 16단계 파이프라인

```
Phase 1   Seed              프로젝트 초기화
Phase 2a  Research          시장/경쟁/기술/사용자 (4 병렬)
Phase 2b  Discovery         context.md 생성
Phase 3   Skeleton          기획서 뼈대
Phase 4   Planning          기획서 챕터 작성 (4단계)
Phase 5   Verify Planning   기획서 검증
Phase 6   Design            UX/Data/API/Security/Infra (병렬)
Phase 7   Verify Design     설계 검증
Phase 8   Implementation    개발 가이드 작성
Phase 9   Verify Impl       구현 가이드 검증
Phase 10  Presentation      PPT 슬라이드 [선택]
Phase 11  Infographic       인포그래픽 [선택]
Phase 12  Build             빌드 트래커
Phase 13  Review            리뷰 체크리스트
Phase 14  QA                QA 리포트
Phase 15  Deploy            배포 가이드
Phase 16  Maintain          운영 가이드
```

---

## 산출물 구조

모든 결과물은 현재 작업 디렉토리의 `specs/{프로젝트명}/` 하위에 생성됩니다.

```
specs/{프로젝트명}/
├── seed.md, context.md, skeleton.md, STATE.md
├── research/       (market, competitor, tech, user)
├── planning/       (01~12장 + _contract.md)
├── {프로젝트명}-기획서.md   (합본)
├── verify/         (planning/design/impl 리포트)
├── design/         (ux/data/api/security/infra/qa/growth/quality)
├── implementation/ (dev-guide, folder-structure, tasks, checklists)
├── presentation/   (slides, generate-ppt)
├── infographic/    (index.html)
├── build/, review/, qa/, deploy/, maintain/
```

---

## 지원 프로젝트 유형

| 유형 | S급 결정 항목 |
|------|--------------|
| 게임 | 엔진, 서버/클라 언어, BM, 렌더링 |
| 웹 SaaS | 프론트 FW, 언어, 백엔드/BaaS, 호스팅, DB |
| 모바일 앱 | 프레임워크, 언어, 상태관리, 백엔드 |
| API 서비스 | 서버 언어/FW, DB, 호스팅, API 스타일 |
| 크롬 확장 | UI FW, 언어, 빌드 도구 |
| 데스크톱 앱 | 프레임워크, 언어, 패키징/배포 |

---

## 운영 모드

- **1인 모드** — S급 결정만 질문, 최소 검증
- **팀 모드** — 방향성 확인, 전체 검증
- **회사 모드** — Company Profile 기반, 전원 확인

---

## 사용 예시

```
"기획서 만들어줘"         → Phase 1(Seed)부터 전체 파이프라인 시작
"VoiceForge 이어서"       → STATE.md 읽어서 중단점부터 재개
"상태"                    → 현재 진행 테이블 출력
"검증해줘"                → 현재 Phase 검증
"PPT 만들어줘"            → Presentation Phase 실행
"인포그래픽"              → Infographic Phase 실행
```

---

## 핵심 원칙

1. **사용자는 CEO** — S급 결정만 질문하고 나머지는 자율 진행
2. **병렬 우선** — 가능한 작업은 반드시 병렬 에이전트로 실행
3. **자동 검증·복구** — Phase 완료 후 자동 검증, FAIL 시 자동 수정
4. **SSOT 3원칙** — 단일 진실 소스 유지, 문서 간 일관성 보장
5. **STATE.md 기반 재개** — 언제든 중단 후 이어서 진행 가능

---

## 엔진 구성

- `orchestrator.md` — 단일 오케스트레이터 (엔트리포인트)
- `runner.js` — Phase 게이트 + 프롬프트 빌더
- `rules/` — core, roles, types, conventions, verify-patterns, recovery
- `templates/` — 36개의 Phase별 에이전트 프롬프트

---

## 설치

```powershell
# Windows
iwr -useb https://raw.githubusercontent.com/karnelian/MakeSkill/master/install.ps1 | iex
```

```bash
# Mac / Linux
curl -fsSL https://raw.githubusercontent.com/karnelian/MakeSkill/master/install.sh | bash
```

설치 후 아무 프로젝트 폴더에서 `/product-spec` 또는 "기획서 만들어줘"라고 입력하면 동작합니다.
