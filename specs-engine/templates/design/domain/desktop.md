# Template: 데스크톱 앱 도메인 설계

## 읽어야 할 파일

- `specs/{프로젝트명}/context.md` (유형, 기술 스택, 성능 목표)
- `specs/{프로젝트명}/planning/05-product-definition.md` (기능 목록)
- `specs/{프로젝트명}/planning/06-technical-overview.md` (프레임워크, 최소 OS 버전)

## 생성할 파일

### system/ — 시스템 설계자 주도

| 파일명 | 내용 |
|--------|------|
| `system-integration.md` | OS 통합 기능 (파일 시스템 접근, 시스템 트레이, 알림, 자동 시작) |
| `native-apis.md` | 네이티브 API 브릿지 설계 (메인↔렌더러 IPC, 보안 샌드박스, 메모리 관리) |

### cross-platform/ — 크로스플랫폼 전문가 주도

| 파일명 | 내용 |
|--------|------|
| `cross-platform-spec.md` | 플랫폼 추상화 레이어 설계 (공유/플랫폼별 코드 경계) |
| `platform-differences.md` | Windows/macOS/Linux 차이점 (UI 컨벤션, 파일 경로, 권한 모델, 빌드 매트릭스) |

### quality/ — QA/접근성/현지화 주도

| 파일명 | 내용 |
|--------|------|
| `accessibility-design.md` | 접근성 설계 (키보드 내비게이션, 스크린 리더 지원, 고대비/고DPI, OS별 접근성 API 연동) |
| `localization-strategy.md` | 현지화 전략 (지원 언어, 리소스 번들 구조, RTL 대응, OS 로케일 연동) — 다국어 시 |
| `crash-reporting.md` | 크래시 리포팅 설계 (미니덤프 수집, 심볼리케이션, 원격 로그 수집, 자동 보고) |

### deployment/ — 배포/업데이트 전문가 주도

| 파일명 | 내용 |
|--------|------|
| `update-deployment.md` | 자동 업데이트 설계 (업데이트 서버, 차등 업데이트, 롤백) |
| `installer-design.md` | 인스톨러 설계 (플랫폼별 인스톨러 형식, 설치 옵션, 언인스톨) |
| `code-signing.md` | 코드 서명 + macOS 공증 (인증서 관리, CI/CD 연동) |

## S급 결정 (사용자 확인 필수)

> ⚠️ 아래 항목은 AI가 임의 결정 금지. 반드시 사용자에게 선택지를 제시하고 확정받은 후 context.md Locked Decision에 기록.

| 결정 항목 | 선택지 예시 |
|----------|------------|
| 프레임워크 | Electron / Tauri / .NET MAUI / Qt / 기타 |
| 프로그래밍 언어 | TypeScript / Rust / C# / C++ / 기타 |
| 패키징/배포 | MSI / DMG / AppImage / Snap / Flatpak / 기타 |

## 정합성 규칙

- 최소 OS 버전 = planning/06-technical-overview.md + qa/os-version-matrix.md 일치
- 프레임워크 (Electron/Tauri) = context.md Locked Decision
- 기능 언급 시 planning/05-product-definition.md 기능 ID(F-xx-xx) 명시
- 성능 목표 (시작 시간, 메모리) = context.md §7

## 품질 기준

- [ ] system/ + cross-platform/ + quality/ + deployment/ 전체 생성
- [ ] 최소 OS 버전 ↔ planning/06-technical-overview.md + qa/ 문서 일치
- [ ] code-signing.md에 macOS 공증 포함
- [ ] installer-design.md 플랫폼별 형식 명시
- [ ] accessibility-design.md 생성 (OS별 접근성 API 연동 명세)
- [ ] localization-strategy.md 생성 (다국어 시)
- [ ] 기능 ID 전수 참조
- [ ] Locked Decision 태그 정확성
- [ ] 단일 문서 내 수치 자기모순 없음
