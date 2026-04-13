# specs-engine v5.4 설치 스크립트 (Windows)
# 사용법: git clone <repo> $HOME\.claude\specs-engine; .\setup.ps1

$InstallDir = "$env:USERPROFILE\.claude\specs-engine"
$CommandsDir = "$env:USERPROFILE\.claude\commands"
$ScriptDir = $PSScriptRoot

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "  specs-engine v5.4 설치"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# 1. 디렉토리 생성
if (-not (Test-Path "$env:USERPROFILE\.claude")) {
    New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude" -Force | Out-Null
}
if (-not (Test-Path $CommandsDir)) {
    New-Item -ItemType Directory -Path $CommandsDir -Force | Out-Null
}

# 2. 클론 위치가 설치 경로가 아니면 Junction 생성
if ($ScriptDir -ne $InstallDir) {
    if (Test-Path $InstallDir) {
        Write-Host "⚠️  이미 $InstallDir 에 설치되어 있습니다."
        Write-Host "   업데이트: cd $InstallDir; git pull"
        Write-Host "   재설치: Remove-Item -Recurse $InstallDir 후 다시 실행"
        exit 0
    }
    Write-Host "📁 Junction 생성: $InstallDir -> $ScriptDir"
    New-Item -ItemType Junction -Path $InstallDir -Target $ScriptDir | Out-Null
}

# 3. Commands 설치
Get-ChildItem "$InstallDir\commands\*.md" -ErrorAction SilentlyContinue | ForEach-Object {
    $name = $_.Name
    if (Test-Path "$CommandsDir\$name") {
        Write-Host "🔄 commands/$name 업데이트"
    } else {
        Write-Host "📋 commands/$name 설치"
    }
    Copy-Item $_.FullName "$CommandsDir\$name" -Force
}

Write-Host ""
Write-Host "✅ 설치 완료!"
Write-Host ""
Write-Host "사용법:"
Write-Host "  1. 아무 프로젝트 폴더에서 Claude Code 실행"
Write-Host "  2. '/product-spec' 또는 '기획서 만들어줘' 입력"
Write-Host ""
Write-Host "업데이트:"
Write-Host '  cd $HOME\.claude\specs-engine; git pull; .\setup.ps1'
Write-Host ""
