# specs-engine v5.3 원격 설치 스크립트 (Windows)
#
# 사용법 (원라이너):
#   iwr -useb https://raw.githubusercontent.com/karnelian/specs-engine/master/install.ps1 | iex
#
# 또는 로컬:
#   .\install.ps1

$ErrorActionPreference = "Stop"
$RepoUrl = "https://github.com/karnelian/specs-engine.git"
$InstallDir = "$env:USERPROFILE\.claude\specs-engine"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  specs-engine v5.3 자동 설치" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# 1. git 확인
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ git이 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host "   먼저 설치하세요: winget install Git.Git" -ForegroundColor Yellow
    exit 1
}

# 2. 이미 설치됨 확인
if (Test-Path $InstallDir) {
    Write-Host "⚠️  이미 설치되어 있습니다: $InstallDir" -ForegroundColor Yellow
    $answer = Read-Host "업데이트할까요? (y/N)"
    if ($answer -eq 'y' -or $answer -eq 'Y') {
        Write-Host "🔄 git pull 중..." -ForegroundColor Cyan
        Push-Location $InstallDir
        git pull
        Pop-Location
    } else {
        Write-Host "취소됨." -ForegroundColor Yellow
        exit 0
    }
} else {
    # 3. 클론
    Write-Host "📥 클론 중: $RepoUrl" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude" -Force | Out-Null
    git clone $RepoUrl $InstallDir
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ git clone 실패" -ForegroundColor Red
        exit 1
    }
}

# 4. setup.ps1 실행
Write-Host ""
Write-Host "⚙️  setup.ps1 실행 중..." -ForegroundColor Cyan
& "$InstallDir\setup.ps1"

Write-Host ""
Write-Host "🎉 설치 완료! 아무 프로젝트에서 '/product-spec' 을 입력하세요." -ForegroundColor Green
Write-Host ""
