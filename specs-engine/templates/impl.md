# Template: 개발 가이드 (Implementation)

## 읽어야 할 파일

| 파일 | 필수 | 부재 시 행동 |
|------|:----:|-------------|
| `specs/{프로젝트명}/context.md` | 🔴 | **BLOCK** — Locked Decisions 없이 태스크 분해 불가 |
| `specs/{프로젝트명}/planning/05-product-definition.md` | 🔴 | **BLOCK** — 기능 목록 없이 태스크 매핑 불가 |
| `specs/{프로젝트명}/planning/06-technical-overview.md` | 🔴 | **BLOCK** — 기술 스택/마일스톤 없이 가이드 작성 불가 |
| `specs/{프로젝트명}/design/` 하위 전체 | 🔴 | **BLOCK** — 원자 태스크의 파일 경로/함수명 도출 불가 |
| `specs/{프로젝트명}/{프로젝트명}-기획서.md` | 🟡 | **DEGRADE** — 전체 맥락 참조 없이 진행 가능, 정합성 저하 |

## 생성할 파일

생성 디렉토리: `specs/{프로젝트명}/implementation/`

### 1. dev-guide.md — 개발 환경 & 컨벤션

- 필수 도구 목록 (**정확한 버전** — context.md Locked Decision 기준)
- 환경 변수 목록 (.env.example)
- 로컬 개발 서버 실행법
- 코딩 컨벤션 (네이밍, 포맷터, 린터)
- Git 브랜치 전략 + 커밋 메시지 규칙 + PR 템플릿
- **S-code/A-code 정의 테이블** — context.md Locked Decisions에서 **글자 그대로 복사** (자체 생성 금지)

### 유형별 개발환경

| 유형 | 핵심 세팅 |
|------|----------|
| **게임** | 엔진 버전 + 프로젝트 템플릿, SDK (광고/분석/결제), 에셋 파이프라인, 프로파일러 |
| **웹 SaaS** | Node.js + 패키지 매니저, 프레임워크 CLI, DB (Docker Compose), ESLint + Prettier |
| **모바일 앱** | RN/Expo/Flutter, Xcode + Android Studio, 에뮬레이터, 코드푸시 |
| **데스크톱 앱** | Electron/Tauri, 네이티브 빌드 도구, 코드 서명, 인스톨러 |
| **크롬 확장** | Manifest V3 보일러플레이트, 핫 리로드 (webpack/vite), 웹스토어 개발자 계정 |
| **API 서비스** | 런타임 + 프레임워크, DB + ORM, OpenAPI/Swagger, Docker Compose |

### 2. folder-structure.md — 프로젝트 폴더 구조

- 유형별 권장 폴더 트리 (ASCII 다이어그램)
- 각 디렉토리 역할 1줄 설명

### 3. tasks/ — 마일스톤 & 태스크 분해

```
tasks/
├── milestone-overview.md    ← 전체 마일스톤 요약 + S/A-code 테이블
├── M1-{이름}.md             ← 기반 구축
├── M2-{이름}.md             ← 핵심 기능
├── M3-{이름}.md             ← 다듬기/QA
├── M4-{이름}.md             ← 런칭
└── post-launch.md           ← 런칭 후
```

#### milestone-overview.md 필수 규칙

- 마일스톤 이름/기간 = planning/06-technical-overview.md **원문 그대로** (자체 명명 금지)
- 기능 ID↔이름 = planning/05-product-definition.md 기능 테이블 **원문 복사** (자체 해석 금지)
- 기능→마일스톤 배정 = planning/06-technical-overview.md 정의 그대로 (임의 이동 금지)
- S코드 전수(S1~Sn) + A코드 전수(A1~An) 최소 1회 등장

#### 원자 단위 태스크 분해 규칙 (필수)

- **파일 경로 명시**: 각 태스크에 대상 파일/컴포넌트 경로 포함
- **시간 단위**: 0.5h ~ 4h (4h 초과 → 더 분해)
- **단일 책임**: 1태스크 = 1함수 또는 1컴포넌트 또는 1설정
- **Week 단위 그룹핑**: W1, W2... 주차별 묶음
- **SSOT 태그**: 관련 Feature ID [F-XX-YY], Tech Stack [A1]~[A14] 명시

#### 유형별 마일스톤 차이

| 유형 | M1 | M2 | M3 | M4 |
|------|----|----|----|----|
| **게임** | 프로토타입 (코어루프) | 버티컬 슬라이스 (1스테이지) | 콘텐츠 확장 + 밸런싱 | 소프트론칭/CBT |
| **웹 SaaS** | 기반 + 인증 | 핵심 기능 | 다듬기 + 성능 | 런칭 |
| **모바일 앱** | 기반 + 인증 | 핵심 기능 | 다듬기 + 성능 | 스토어 심사 + 런칭 |
| **데스크톱 앱** | 기반 + 쉘 | 핵심 기능 | 크로스플랫폼 + 성능 | 배포 + 서명 |
| **크롬 확장** | 기반 + ManifestV3 | 핵심 기능 | 호환성 + 성능 | 웹스토어 심사 |
| **API 서비스** | 기반 + 인증 | 핵심 엔드포인트 | 문서 + SDK | 런칭 + 모니터링 |

### 4. checklists/ — 유형별 체크리스트

```
checklists/
├── pre-development.md   ← 개발 시작 전 (도구/환경/저장소)
├── pre-launch.md        ← 런칭 전 (기능/성능/보안/모니터링)
├── post-launch.md       ← 런칭 후 (모니터링/피드백/업데이트)
└── {유형별}.md          ← 유형 전용 (game/mobile/chrome-ext/desktop/api/web-saas)
```

#### 체크리스트 SSOT 규칙

- 도구/버전 = context.md Locked Decision **정확한 버전** + 결정 코드 [S1][A1]
- 기능/모드명 = planning/05-product-definition.md **SSOT 기능명 그대로** (일반적 나열 금지)
- 성능 수치 = context.md §7 Performance Targets **수치 그대로** (임의 수치 금지)
- 가격/티어 수치 = context.md §S4 + planning/05-product-definition.md 프리미엄 비교표 **그대로 복사**
- Pro vs Pro+ 수치 혼동 금지 — 각 티어 개별 확인

## 품질 기준

- [ ] dev-guide.md — 개발환경, 컨벤션, Git 전략, S/A-code 테이블 포함
- [ ] folder-structure.md — ASCII 트리 + 디렉토리 설명
- [ ] milestone-overview.md — 마일스톤 이름/기간 = planning/06-technical-overview.md 원문
- [ ] milestone-overview.md — 기능 ID↔이름 = planning/05-product-definition.md 원문 복사
- [ ] milestone-overview.md — S코드 전수 + A코드 전수 최소 1회 등장
- [ ] S/A-code 정의 테이블 = context.md Locked Decisions 글자 단위 복사
- [ ] 태스크 전체 **원자 단위** (파일 경로 명시, 4h 이하)
- [ ] 태스크가 planning/05-product-definition.md 기능 목록 **전체 커버**
- [ ] 태스크 [A-code] 태그가 내용과 직접 관련
- [ ] Pricing/Free/Pro/Pro+ 수치 = SSOT 원문 복사
- [ ] 체크리스트 항목 = SSOT 원문 + 결정 코드 태그
- [ ] 유형별 체크리스트 포함
