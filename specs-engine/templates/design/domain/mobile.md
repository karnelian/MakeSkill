# Template: 모바일 앱 도메인 설계

## 읽어야 할 파일

- `specs/{프로젝트명}/context.md` (유형, 성능 목표, 지원 OS)
- `specs/{프로젝트명}/planning/05-product-definition.md` (기능 목록)
- `specs/{프로젝트명}/planning/06-technical-overview.md` (프레임워크, 최소 OS 버전)

## 생성할 파일

### platform/ — iOS/Android 전문가 주도

| 파일명 | 내용 |
|--------|------|
| `ios-guidelines.md` | iOS 전용 설계 (HIG 준수, 권한 사용 명세, 딥링크, 생체인증, 스토어 심사 체크리스트) |
| `android-guidelines.md` | Android 전용 설계 (Material Design 준수, 권한, 딥링크, 백그라운드 제한) |
| `cross-platform-strategy.md` | 크로스 플랫폼 전략 (공유 코드/플랫폼별 코드 경계, 네이티브 모듈 정책) |

### aso/ — ASO 전문가 주도

| 파일명 | 내용 |
|--------|------|
| `store-listing.md` | 스토어 등록 정보 (앱 이름, 설명, 키워드, 카테고리). context.md §S4 가격 반영 |
| `screenshots-strategy.md` | 스크린샷 구성 (화면 선정, 캡션, 디바이스 프레임, A/B 테스트 계획) |
| `ratings-strategy.md` | 평점/리뷰 관리 (인앱 리뷰 요청 시점, 부정 리뷰 대응) |

### quality/ — QA/접근성/보안 주도

| 파일명 | 내용 |
|--------|------|
| `accessibility-design.md` | 접근성 설계 (VoiceOver/TalkBack 지원, 다이나믹 타입, 고대비, 터치 타겟 크기, 모션 감소) |
| `security-design.md` | 보안 설계 (키체인/키스토어 사용, 인증서 피닝, 탈옥/루팅 감지, 난독화, OWASP Mobile Top 10) |
| `push-notification-strategy.md` | 푸시 알림 전략 (FCM/APNs 설정, 알림 채널 분류, 발송 시점/빈도 정책, 권한 요청 UX) |
| `deep-link-design.md` | 딥링크 설계 (Universal Links/App Links, 딜레이드 딥링크, 라우팅 매핑, UTM 파라미터) |
| `widget-system-integration.md` | 위젯/시스템 통합 (iOS 위젯/Android 위젯, 라이브 액티비티, 단축어/인텐트, 공유 확장) — 해당 시 |
| `crash-reporting.md` | 크래시 리포팅 설계 (Crashlytics/Sentry 설정, 심볼리케이션, 알림 임계값, 크래시프리 목표율) |
| `localization-strategy.md` | 현지화 전략 (지원 언어, RTL 대응, 날짜/통화 포맷, 번역 파이프라인) — 다국어 시 |

### performance/ — 성능 전문가 주도

| 파일명 | 내용 |
|--------|------|
| `battery-optimization.md` | 배터리 최적화 (백그라운드 작업 제한, 위치 서비스 정책, 네트워크 배칭) |
| `offline-strategy.md` | 오프라인 전략 (로컬 캐시, 큐잉, 동기화 충돌 해결, 오프라인 퍼스트 아키텍처) |
| `performance-budget.md` | 성능 예산 (앱 크기, 시작 시간, 메모리). context.md §7 수치 정확 인용 |

## S급 결정 (사용자 확인 필수)

> ⚠️ 아래 항목은 AI가 임의 결정 금지. 반드시 사용자에게 선택지를 제시하고 확정받은 후 context.md Locked Decision에 기록.

| 결정 항목 | 선택지 예시 |
|----------|------------|
| 프레임워크 | React Native / Flutter / Kotlin Multiplatform / SwiftUI+Kotlin / 기타 |
| 프로그래밍 언어 | TypeScript / Dart / Kotlin / Swift / 기타 |
| 상태 관리 | Redux / Zustand / Riverpod / MobX / 기타 |
| 백엔드/BaaS | Firebase / Supabase / AWS Amplify / 자체 서버 / 기타 |

## 정합성 규칙

- ios-guidelines.md/android-guidelines.md 최소 OS 버전 = planning/06-technical-overview.md + qa/device-matrix.md 일치
- 스토어 가격 = context.md §S4
- 성능 예산 수치 = context.md §7 Performance Targets
- push-notification-strategy.md 채널 = ios-guidelines.md + android-guidelines.md 권한 명세 일치
- deep-link-design.md 라우팅 = api-endpoints.md + screen-mockups.md 화면 매핑 일치
- 기능 언급 시 planning/05-product-definition.md 기능 ID(F-xx-xx) 명시

## 품질 기준

- [ ] platform/ + aso/ + quality/ + performance/ 전체 생성
- [ ] 최소 OS 버전 ↔ planning/06-technical-overview.md + qa/ 문서 일치
- [ ] performance-budget.md 수치 ↔ §7 일치
- [ ] store-listing.md 가격 ↔ §S4 일치
- [ ] accessibility-design.md 생성 (VoiceOver/TalkBack 지원 명세)
- [ ] security-design.md 생성 (OWASP Mobile Top 10 기반)
- [ ] push-notification-strategy.md 생성 (FCM/APNs 설정)
- [ ] deep-link-design.md 생성 (Universal Links/App Links)
- [ ] crash-reporting.md 크래시프리 목표율 ↔ §7 일치
- [ ] 기능 ID 전수 참조
- [ ] Locked Decision 태그 정확성
- [ ] 단일 문서 내 수치 자기모순 없음
