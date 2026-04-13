# Template: 게임 도메인 설계

## 읽어야 할 파일

- `specs/{프로젝트명}/context.md` (유형, 가격 정책, 성능 목표)
- `specs/{프로젝트명}/planning/05-product-definition.md` (기능 목록, 게임 모드, 콘텐츠 볼륨)
- `specs/{프로젝트명}/planning/06-technical-overview.md` (엔진, SDK, 성능 목표)
- `specs/{프로젝트명}/design/ux/design-system.md` (컬러/아트 토큰)

## 생성할 파일

### game-design/ — 게임 디자이너 주도

| 파일명 | 내용 |
|--------|------|
| `core-loop.md` | 코어루프 정의 (텍스트 다이어그램). 플레이어 동기 → 행동 → 보상 → 반복 |
| `game-mechanics.md` | 핵심 메카닉 상세 규칙. 전투/퍼즐/수집 등 장르별 코어 시스템 |
| `progression-system.md` | 성장/진행 시스템 (레벨/경험치/스킬트리/언락) |
| `balance-spreadsheet.md` | **중앙 밸런스 데이터 시트** — 캐릭터/적/아이템/스킬의 모든 수치를 단일 문서로 관리. 다른 문서는 이 시트를 참조 |
| `reward-system.md` | 보상 체계 (루프별 보상, 일일/주간/시즌 보상) |
| `tutorial-flow.md` | 튜토리얼/온보딩 (첫 실행 → 코어루프 체험까지) |
| `social-features.md` | 소셜 기능 (길드/친구/PvP/랭킹) — 해당 시 |

### level-design/ — 레벨/콘텐츠 디자이너 주도

| 파일명 | 내용 |
|--------|------|
| `stage-design-guide.md` | 스테이지/맵 설계 가이드 (레이아웃 원칙, 난이도 배치) |
| `difficulty-curve.md` | 난이도 곡선 (밸런스 시트 참조). 스테이지별 예상 클리어율/시간 |
| `content-volume.md` | 콘텐츠 볼륨 계획 (마일스톤별 스테이지 수, 캐릭터 수, 아이템 수) |
| `event-system.md` | 시즌/이벤트 시스템 설계 — 해당 시 |

### narrative/ — 내러티브 디자이너 주도

| 파일명 | 내용 |
|--------|------|
| `synopsis-logline.md` | 시놉시스 + 로그라인 (한줄 요약, 엘리베이터 피치, 장르/톤/핵심 갈등 정의) |
| `world-building.md` | 세계관 바이블 (배경, 설정, 규칙) |
| `characters.md` | 캐릭터 프로필 (주인공/적/NPC). 성격, 역할, 시각 참조 |
| `story-outline.md` | 메인 스토리 아웃라인 (챕터/스테이지별) — 해당 시 |
| `dialogue-style-guide.md` | 대사 톤/스타일 가이드 — 해당 시 |

### art/ — 아트 디렉터 주도

| 파일명 | 내용 |
|--------|------|
| `art-direction.md` | 아트 스타일 가이드 (레퍼런스 이미지 설명, 컬러 팔레트, 톤) |
| `art-resource-strategy.md` | 리소스 확보 전략 (외주/에셋스토어/AI/자체). 예산 배분 |
| `asset-pipeline.md` | 에셋 파이프라인 (제작 → 임포트 → 최적화), 네이밍 규칙, 전체 에셋 목록 |
| `character-art-spec.md` | 캐릭터 아트 사양 (해상도, 스프라이트 시트, 애니메이션 프레임) |
| `environment-art-spec.md` | 배경/환경 아트 사양 |
| `vfx-spec.md` | 이펙트/VFX 사양 (파티클, 히트 이펙트, UI 이펙트) |

### sound/ — 사운드 디자이너 주도

| 파일명 | 내용 |
|--------|------|
| `sound-design.md` | 사운드 디자인 총괄 (방향성, 구현 가이드) |
| `sound-resource-strategy.md` | 리소스 확보 전략 (AI/외주/라이브러리). 예산 배분 |
| `music-direction.md` | BGM 목록 + 적응형 음악 설계 (씬별 음악 전환) |
| `sfx-list.md` | SFX 목록 (UI/전투/환경/캐릭터별) |

### quality/ — QA/접근성/현지화 주도

| 파일명 | 내용 |
|--------|------|
| `accessibility-design.md` | 접근성 설계 (색맹 모드, 자막, 조작 리매핑, 난이도 옵션, 화면 읽기 지원) |
| `localization-strategy.md` | 현지화 전략 (지원 언어, 번역 파이프라인, 문화권별 콘텐츠 변경, 폰트/텍스트 확장 대응) |
| `playtesting-plan.md` | 플레이테스트 계획 (내부/외부 테스트 일정, 피드백 수집 방법, 반복 주기, 핵심 검증 지표) |
| `performance-optimization.md` | 성능 최적화 계획 (목표 FPS, 메모리 예산, 드로우콜/배칭, LOD, 프로파일링 도구). context.md §7 기준 |
| `platform-submission-checklist.md` | 플랫폼 심사 체크리스트 (Steam/App Store/Google Play/Console별 필수 요건, 등급 심사, 가이드라인) |
| `credits-attribution.md` | 크레딧/에셋 라이선스 관리 (사용 에셋 출처, 라이선스 유형, 필수 표기 사항) |

### server/ — 서버 설계자 주도

| 파일명 | 내용 |
|--------|------|
| `leaderboard-design.md` | 리더보드/랭킹 설계 (글로벌/시즌/친구). 싱글 게임일 경우 |
| `multiplayer-arch.md` | 멀티플레이어 아키텍처 (매치메이킹/동기화/지연보상). 멀티플레이 게임일 경우 |
| `anti-cheat-design.md` | 안티치트/보안 설계 (서버 권위 모델, 입력 검증, 메모리 보호, 신고 시스템) — 온라인 게임 시 |

### live-ops/ — 라이브 서비스 주도

| 파일명 | 내용 |
|--------|------|
| `live-service-plan.md` | 라이브 서비스 계획 (패치 주기, 콘텐츠 업데이트 로드맵, 커뮤니티 채널, 핫픽스 정책) — 해당 시 |
| `community-strategy.md` | 커뮤니티 전략 (디스코드/포럼/SNS 운영, 유저 피드백 수집, 공지 프로세스) — 해당 시 |

### monetization/ — 모네타이제이션 설계자 주도

| 파일명 | 내용 |
|--------|------|
| `iap-design.md` | 인앱 상품 카탈로그, 가격 정책 (지역별). context.md §S4 가격 정확 일치 |
| `economy-design.md` | 게임 내 경제 설계 (재화 종류, 획득/소비 밸런스). balance-spreadsheet.md 참조 |
| `ad-placement.md` | 광고 배치 설계 (위치/빈도/보상형 광고 조건) |
| `battlepass-design.md` | 배틀패스 설계 (티어/보상/가격/기간) — 해당 시 |

## S급 결정 (사용자 확인 필수)

> ⚠️ 아래 항목은 AI가 임의 결정 금지. 반드시 사용자에게 선택지를 제시하고 확정받은 후 context.md Locked Decision에 기록.

| 결정 항목 | 선택지 예시 |
|----------|------------|
| 게임 엔진 | Unity / Godot / Unreal / Cocos Creator / GameMaker / 기타 |
| 서버 언어 | Go / Node.js / C# (.NET) / Rust / Java / 기타 |
| 클라이언트 프로그래밍 언어 | C# / GDScript / C++ / 기타 (엔진 종속) |
| 비즈니스 모델 | F2P / B2P / 구독 / F2P+B2P 병행 |
| 렌더링 방식 | 2D 픽셀아트 / 2D 벡터 / 2.5D / 3D |

## 정합성 규칙

- balance-spreadsheet.md를 수치 SSOT로 사용 — difficulty-curve, economy-design 등은 이 시트 참조
- 기능 언급 시 planning/05-product-definition.md 기능 ID(F-xx-xx) 명시
- IAP 가격 = context.md §S4 가격 (1원 단위 일치)
- 경제 밸런스 수치 = context.md §S4 + 수익 구조 정합
- 성능 예산 (FPS/메모리) = context.md §7 Performance Targets
- 콘텐츠 볼륨 (스테이지 수, 캐릭터 수) = planning/05-product-definition.md §5.3 정본 수량
- 마일스톤별 콘텐츠 배정 = planning/05-product-definition.md §5.5 + planning/06-technical-overview.md 기준

## 품질 기준

- [ ] core-loop.md + game-mechanics.md 생성 (코어 게임플레이 정의)
- [ ] synopsis-logline.md 생성 (시놉시스/로그라인 — 내러티브 있는 게임 필수)
- [ ] balance-spreadsheet.md 생성 (중앙 밸런스 데이터 시트)
- [ ] difficulty-curve.md가 balance-spreadsheet.md 참조
- [ ] art-resource-strategy.md + sound-resource-strategy.md 생성 (확보 전략 + 예산)
- [ ] asset-pipeline.md에 전체 에셋 목록 + 네이밍 규칙 포함
- [ ] credits-attribution.md에 사용 에셋 라이선스 전수 기록
- [ ] iap-design.md 가격 ↔ context.md §S4 1원 단위 일치
- [ ] economy-design.md 수치 ↔ balance-spreadsheet.md 정합
- [ ] accessibility-design.md 생성 (접근성 옵션 정의)
- [ ] localization-strategy.md 생성 (다국어 지원 시)
- [ ] performance-optimization.md 수치 ↔ context.md §7 일치
- [ ] platform-submission-checklist.md 생성 (출시 대상 스토어별)
- [ ] playtesting-plan.md 생성 (테스트 일정 + 피드백 루프)
- [ ] anti-cheat-design.md 생성 (온라인 게임 시 필수)
- [ ] 콘텐츠 볼륨 ↔ planning/05-product-definition.md §5.3 정본 수량 일치
- [ ] 마일스톤별 콘텐츠 배정 ↔ planning/05-product-definition.md §5.5 일치
- [ ] planning/05-product-definition.md 기능 ID 전수 참조 (도메인 문서에서 기능 언급 시 ID 명시)
- [ ] Locked Decision 태그 정확성
- [ ] 단일 문서 내 수치 자기모순 없음 (합계 = 항목 합산, 동일 수치 문서 내 중복 시 일치)
- [ ] 교차 예산 검증: art-resource-strategy.md 합계 + sound-resource-strategy.md 합계 = 합산 인용값 일치
