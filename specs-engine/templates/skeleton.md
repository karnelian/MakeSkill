# Template: Skeleton

기획서 12장 + 설계서 + 개발가이드의 전체 목차를 설계하는 단계.
유일한 중간 확인 포인트로, 사용자에게 구조를 확인받는다.

## 읽어야 할 파일

| 파일 | 필수 | 부재 시 행동 |
|------|:----:|-------------|
| `specs/{프로젝트명}/seed.md` | 🔴 | **BLOCK** — Phase 1(Seed) 먼저 실행 |
| `specs/{프로젝트명}/context.md` | 🔴 | **BLOCK** — Phase 2b(Discovery) 먼저 실행 |

## 생성할 파일

- `specs/{프로젝트명}/skeleton.md`

---

## 프로세스

### 1. 기획서 목차 (12장)

```
1. Executive Summary (개요)
2. 시장 분석 (Market Analysis)
3. 경쟁사 분석 (Competitive Analysis)
4. 사용자 분석 (User Analysis)
5. 제품 정의 (Product Definition)
6. 기술 개요 (Technical Overview)
7. 비즈니스 모델 (Business Model)
8. Go-to-Market 전략
9. 성과 지표 (Metrics & KPI)
10. 로드맵 (Roadmap)
11. 리스크 분석 (Risk Analysis)
12. 부록 (Appendix)
```

기획서 생성 순서 (고정): 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 1(마지막) -> 12

### 2. 분량 배분표

| 섹션 | 최소 라인 | 목표 라인 | 담당 |
|------|----------|----------|------|
| 1. Executive Summary | 80 | 130 | plan-roadmap (마지막) |
| 2. 시장 분석 | 120 | 200 | plan-market |
| 3. 경쟁사 분석 | 120 | 200 | plan-market |
| 4. 사용자 분석 | 120 | 200 | plan-user |
| 5. 제품 정의 | 250 | 400 | plan-user |
| 6. 기술 개요 | 140 | 230 | plan-tech |
| 7. 비즈니스 모델 | 120 | 200 | plan-business |
| 8. GTM 전략 | 80 | 140 | plan-business |
| 9. 성과 지표 | 80 | 140 | plan-business |
| 10. 로드맵 | 70 | 120 | plan-roadmap |
| 11. 리스크 분석 | 70 | 120 | plan-roadmap |
| 12. 부록 | 50 | 100 | plan-roadmap |
| **합계** | **1,300** | **2,180** | |

이 분량표가 이후 조립 단계의 최소 라인 검증 기준이 된다.

### 3. 역할 배정표

| 섹션 | 주도 | 검토 |
|------|------|------|
| 1장 | CEO | 전원 |
| 2장 | 마케터 | CFO, CEO |
| 3장 | 마케터 | CTO, UX 리서처 |
| 4장 | UX 리서처 | 마케터, CEO |
| 5장 | UX 리서처 | CTO, CEO |
| 6장 | CTO | CFO, CEO |
| 7장 | CFO | 마케터, CEO |
| 8장 | 마케터 | CFO, CEO |
| 9장 | CFO | 마케터, UX 리서처 |
| 10장 | CEO | CTO, CFO |
| 11장 | 전원 공동 | CEO 최종 판정 |
| 12장 | CTO | - |

### 4. 설계서 목차 (유형별)

context.md의 유형에 따라 해당 문서만 포함한다.

**공통 영역** (모든 유형):
- `design/ux/` — UX/UI 설계
- `design/data/` — 데이터/DB 설계
- `design/api/` — API 설계
- `design/security/` — 보안 설계
- `design/infra/` — 인프라 설계
- `design/qa/` — QA 설계

**유형별 전문 영역**:
- 게임: `design/game-design/`, `design/level-design/`, `design/narrative/`, `design/art/`, `design/sound/`, `design/server/`, `design/monetization/`
- 웹 SaaS: `design/growth/`
- 모바일: `design/platform/`, `design/aso/`, `design/performance/`
- API: `design/docs/`
- 크롬 확장: `design/platform/`, `design/privacy/`, `design/aso/`
- 데스크톱: `design/system/`, `design/cross-platform/`, `design/deployment/`

### 5. 개발가이드 목차

유형에 따른 `implementation/` 하위 구조:
- 공통: dev-environment-setup, project-structure, coding-conventions, git-workflow
- 유형별 세팅 가이드
- `tasks/`: milestone-overview, m1~m4, post-launch
- `checklists/`: 유형별

### 6. skeleton.md 생성 후 사용자 확인

구조를 사용자에게 보여주고 확인받는다. 수정 요청이 있으면 반영 후 다시 확인.

---

## SSOT 구조 검증

1. context.md 마일스톤 수 = `implementation/tasks/` 파일 수 (1:1 대응)
2. 유형에 해당하지 않는 `design/` 디렉토리가 목차에 포함되면 FAIL
3. 분량 배분표 변경 시 skeleton.md를 먼저 수정

---

## 품질 기준

- [ ] 기획서 12장 목차 전체 포함
- [ ] 섹션별 목표 라인 수 배정
- [ ] 설계서 목차 구성 (유형별 정확성)
- [ ] 개발가이드 목차 구성
- [ ] 섹션별 담당 역할 배정
- [ ] 사용자 구조 확인 완료
- [ ] skeleton.md 생성
- [ ] context.md 마일스톤 수와 tasks/ 파일 수 일치
- [ ] 유형별 설계서 목차 정확성 확인
