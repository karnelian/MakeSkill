# Template: 기획서 검증 (Planning Verify)

## 읽어야 할 파일

| 파일 | 필수 | 부재 시 행동 |
|------|:----:|-------------|
| `specs/{프로젝트명}/planning/_contract.md` | 🔴 | **BLOCK** — 유일한 검증 기준, 없으면 검증 자체 불가 |
| `specs/{프로젝트명}/planning/*.md` ch01~ch12 | 🔴 | **BLOCK** — 검증 대상 없음 |
| `specs/{프로젝트명}/skeleton.md` | 🔴 | **BLOCK** — 목표 라인수 기준 없이 P-ASM-1 실행 불가 |
| `specs/{프로젝트명}/context.md` | 🔴 | **BLOCK** — SSOT 수치 교차검증 불가 |
| `specs/{프로젝트명}/STATE.md` | 🟡 | **DEGRADE** — 현재 Phase 미확인, 전체 챕터 검증으로 대체 |

## 실행할 패턴

### P1: Contract SSOT 수치 정합성

- **검증**: _contract.md C1(가격), C2(핵심 수치)에서 수치 추출 → 전 챕터 Grep 대조
- **기준**: 불일치 0건 → PASS
- **FAIL 시**: contract C2 기준으로 해당 챕터 수정

### P2: Contract 기능/마일스톤 스코프

- **검증**: C4(Feature Registry)에서 v1=❌ 목록 추출 → 전 챕터 Grep. v1 맥락에서 v2 기능 사용 → FAIL
- **검증**: C5(Milestones) 라벨/기간 → 전 챕터 대조
- **기준**: 불일치 0건 → PASS

### P3: 시나리오 수치 원문 복사

- **검증**: ch07 Conservative/Base/Optimistic 시나리오 테이블 → 대상 문서 대조
- **기준**: 불일치 0건, 산술 오류 0건, 단순 배율 적용 0건 → PASS

### P5: 출처율 검증

- **검증**: [출처:] 또는 [추정] 태그 비율 계산
- **기준**: 80% 이상 → PASS, 70~80% → WARNING, 70% 미만 → FAIL
- **P5-B**: 수치 챕터(ch02~ch09)에 태그 0건 → 자동 보강 루프 (WebSearch 최대 3회/챕터)

### P11: C4 역매칭 — 챕터 기능 주장 vs 레지스트리

- **대상**: ch03(경쟁 비교), ch04(JTBD), ch05(기능 목록), ch08(GTM)
- **검증**: 각 챕터에서 보유 주장하는 기능 → C4 Feature ID 매핑 확인
- **기준**: C4 미등록 기능 주장 0건 → PASS

### P12-A~E: 5대 Peer 대조

| 서브패턴 | 정본 | 대상 | 검증 방법 |
|----------|------|------|----------|
| **P12-A** 중간 월 | ch09 월별 테이블 | ch08 월별 성장표, ch01 | M1~M11 MAU/DAU/MRR 1:1 대조 |
| **P12-B** 인프라 비용 | ch06 | C7 → ch07/ch01/ch12 | ch06=C7=ch07 3-way 일치 |
| **P12-C** 프리미엄 비교표 | C3 (ch05) | ch07, ch01 | 셀 단위 1:1 대조 |
| **P12-D** 페르소나 수치 | ch04 | ch07, ch08 | 지출/연령/빈도 수치 대조 + 산술 검증 |
| **P12-E** 마케팅 예산 | ch08 | ch07, ch01 | ch08=ch07=ch01 마케팅 비용 일치 |

## 숫자 교차검증 절차

### Contract C2 기준 대조

1. **contract C2에서 앵커 수치 추출**: MAU, 전환율, 가격, 월매출, 연매출
2. **ch09에서 M12행 + M1~M12 MRR 합산** → contract C2와 대조
3. **ch01/ch02/ch07에서 동일 지표 Grep** → contract C2와 대조
4. **역산 검증**: `MAU × 전환율 × 가격 = 월매출`, `월매출 × 12 = 연매출` 등식 성립 확인
5. **"Year 1 매출" run-rate vs cumulative 미표기** → FAIL
6. **FAIL 시**: contract C2 기준으로 직접 수정 → 재대조 (최대 3회). 불일치 상태를 사용자에게 보여주지 않음

### P13: C2 파생 수치 산술 검증

- ch09 M1~M12 MRR 합산 ↔ C2 "Y1 누적 매출" 대조 (허용 오차 ±5%)
- 오차 5% 초과 → FAIL → ch09 MRR 합산을 정본으로 C2 수정

## 생성할 파일

`specs/{프로젝트명}/verify/planning-report.md` — 검증 리포트

## 품질 기준

- [ ] P1 Contract SSOT 수치 전 챕터 일치
- [ ] P2 v2 기능 v1 맥락 혼입 0건
- [ ] P3 시나리오 수치 ch07 원문 일치
- [ ] P5 출처율 80% 이상 (수치 챕터 태그 3건 이상)
- [ ] P11 C4 미등록 기능 주장 0건
- [ ] P12-A~E 5대 Peer 대조 전체 PASS
- [ ] 숫자 교차검증 — contract C2 ↔ ch09 ↔ ch01/ch02/ch07 전수 일치
- [ ] P13 MRR 합산 ↔ C2 Y1 누적 오차 ±5% 이내
