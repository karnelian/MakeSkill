---
name: product-spec
description: "제품/서비스 기획서 + 기술 설계서 + 개발 가이드를 자동 생성하는 올인원 시스템. AI 전문가 팀이 기획서~설계서~개발가이드~PPT까지 자동 산출. 사용자는 CEO로서 S급 결정만. '기획서', '사업계획서', 'PRD', 'product spec', '제품 기획', '서비스 기획', '프로젝트 기획', '기획서 만들어줘' 등의 키워드로 트리거."
version: "5.3.0"
author: "STOIC"
---

# Product Spec Engine v5.3

**엔진 위치**: `~/.claude/specs-engine/`
**엔트리포인트**: `~/.claude/specs-engine/orchestrator.md`

---

## 실행 방법

이 스킬이 호출되면:

1. **`~/.claude/specs-engine/orchestrator.md`를 읽는다** — 전체 파이프라인 정의
2. **`specs/` 디렉토리에서 기존 프로젝트를 확인한다** — STATE.md가 있으면 이어서 진행
3. **현재 Phase에 맞는 템플릿을 읽어 에이전트를 실행한다**

### 핵심 원칙
- 사용자 = CEO. S급 결정만 질문, 나머지 자율 진행
- 병렬 가능한 작업은 반드시 병렬 에이전트로 실행
- 각 Phase 완료 후 자동 검증, FAIL 시 자동 수정

---

## 라우팅

| 입력 | 동작 |
|------|------|
| `{아이디어}` | → Phase 1(Seed): `templates/seed.md` 읽어서 실행 |
| `다음` / `계속` / `진행` | → STATE.md 읽고 다음 Phase 자동 진행 |
| `상태` | → STATE.md 읽고 진행 테이블 출력 |
| `검증` / `verify` | → 현재 Phase 검증 실행 |
| `PPT` / `발표자료` | → `templates/presentation.md` 실행 |
| `인포그래픽` | → `templates/infographic.md` 실행 |
| `{프로젝트명} 이어서` | → 해당 프로젝트 STATE.md 로드 후 재개 |

---

## 파이프라인 (16 Phase)

```
Phase 1: Seed → 2a: Research(4병렬) → 2b: Discovery → 3: Skeleton
→ 4: Planning(4단계) → 5: Verify(Planning) → 6: Design(4병렬) → 7: Verify(Design)
→ 8: Implementation → 9: Verify(Impl) → 10: Presentation → 11: Infographic
→ 12: Build → 13: Review → 14: QA → 15: Deploy → 16: Maintain
```

---

## 에이전트 프롬프트 구성

각 Phase 실행 시:
1. `specs-engine/templates/{해당 템플릿}.md` 읽기
2. `specs-engine/rules/{필요한 규칙}.md` 읽기
3. 프로젝트 변수 치환 ({프로젝트명}, {유형}, {운영모드})
4. 결합하여 Agent tool prompt로 전달

---

## 산출물 위치

모든 산출물은 **현재 작업 디렉토리**의 `specs/{프로젝트명}/` 하위에 생성:
```
specs/{프로젝트명}/
├── seed.md, context.md, skeleton.md, STATE.md
├── research/{market,competitor,tech,user}.md
├── planning/{01~12장}.md + _contract.md
├── {프로젝트명}-기획서.md (합본)
├── verify/{planning,design,impl}-report.md
├── design/{ux,data,api,security,infra,qa,growth,quality}/*.md
├── implementation/{dev-guide,folder-structure,tasks,checklists}/*.md
├── presentation/{slides-content,generate-ppt}.*
├── infographic/{index.html,README.md}
├── build/build-tracker.md
├── review/review-checklist.md
├── qa/qa-report.md
├── deploy/deploy-guide.md
└── maintain/ops-guide.md
```

---

## 상세 실행 로직은 orchestrator.md 참조

이 스킬은 라우터 역할만 한다.
실제 Phase별 실행 로직, 템플릿 구조, 검증 패턴은 모두:
→ **`~/.claude/specs-engine/orchestrator.md`** 에 정의되어 있다.

반드시 orchestrator.md를 먼저 읽은 후 실행한다.

$ARGUMENTS
