# Core Rules — 공통 규칙

모든 Phase/에이전트가 준수하는 보편 규칙.

---

## 1. 파일 경로 규칙

```
specs/{프로젝트명}/
├── seed.md                    # Phase 1
├── STATE.md                   # 상태 추적 (SSOT)
├── research/                  # Phase 2a (market/competitor/tech/user)
├── context.md                 # Phase 2b
├── skeleton.md                # Phase 3
├── planning/                  # Phase 4 (01~12 + _contract.md)
├── {프로젝트명}-기획서.md       # Phase 5 합본
├── verify/                    # Phase 5/7/9 (planning/design/impl 검증 리포트)
├── design/                    # Phase 6 (ux/data/api/security/infra/qa + 도메인별)
├── implementation/            # Phase 8 (tasks/checklists)
├── presentation/              # Phase 10
├── infographic/               # Phase 11
├── build/                     # Phase 12 (build-tracker.md)
├── review/                    # Phase 13 (review-checklist.md)
├── qa/                        # Phase 14 (qa-report.md)
├── deploy/                    # Phase 15 (deploy-guide.md)
└── maintain/                  # Phase 16 (ops-guide.md)
```

---

## 2. 문서 작성 규칙

- **표 필수**: 섹션당 최소 1개 표 포함
- **출처 태그**: 외부 데이터는 `[출처: {보고서/URL}]`, 검색 불가 시 `[추정: {근거}]`
- **분량 기준**: skeleton.md 목표 라인 수의 80% 이상 달성 필수
- **WebSearch**: 시장/경쟁사/벤치마크 등은 최소 3회 검색 후 작성

---

## 3. 절대 금지 규칙

```
NEVER:
- "이런 기능도 추가하면 좋을 것 같습니다" (스코프 크리프)
- "추가로 ~도 고려해보시면 어떨까요?"
- "다음 섹션에서 다루겠습니다" (해당 섹션에서 완결)
- 기획에 없는 기능을 슬쩍 넣기
- 사용자가 "더 할 거 있어?"라고 물었을 때 새 기능 제안

ALWAYS:
- "현재 기획 범위 내에서 모두 완료했습니다."
- "추가하실 게 있으시면 말씀해주세요."
- 사용자가 직접 "이거 추가하자" → 그때만 반영
```

---

## 4. 결정 체계 (요약)

| 등급 | 결정자 | 설명 |
|------|--------|------|
| **S급** | 사용자(진짜 CEO) | 기반 결정, 나중에 바꾸기 어려움 → 반드시 사용자에게 질문 |
| **A급** | AI CEO → 보고 | 중요하지만 전문가 판단으로 충분 |
| **B급** | 담당 역할 자체 | 실무적 결정, 보고 불필요 |

S급 공통: 기술스택, 타겟 사용자, 핵심 차별점, 수익 모델, 아트/사운드 전략

---

## 5. SSOT 산술 검증 3원칙

1. **역산 일치**: MAU × 전환율 × 가격 = 매출. 역산 불일치 → FAIL
2. **부분합 ≤ 전체**: 세그먼트별 합 ≤ 전체. 부분집합 > 전체 차단
3. **교차 문서 일치**: context.md = ch07 = ch09. ±5% 초과 → FAIL

---

## 6. Phase 완료 리포트 (필수)

모든 Phase 완료 시 반드시 출력:
- 이번 Phase에서 한 일 (1~3줄)
- 핵심 결정 & 이유 (S/A급 결정 + 토론 요약)
- 산출물 (파일 목록 + 분량)
- 주의할 점 / 열린 이슈
- 다음 단계 안내

---

## 7. 컨텍스트 엔지니어링

- 각 에이전트는 필요한 파일만 읽는다. 불필요한 컨텍스트 로딩 금지
- 이전 Phase 산출물 참조 시 경로만 명시
- 한 에이전트 = 한 전문 영역 = 한 컨텍스트
