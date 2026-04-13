@echo off
REM specs-engine v5.3 Windows 설치 (더블클릭)
REM 관리자 권한 불필요

echo.
echo ==================================
echo   specs-engine v5.3 설치
echo ==================================
echo.

REM git 확인
where git >nul 2>nul
if errorlevel 1 (
    echo [ERROR] git이 설치되어 있지 않습니다.
    echo        먼저 설치하세요: winget install Git.Git
    echo.
    pause
    exit /b 1
)

REM PowerShell로 install.ps1 실행
powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -useb https://raw.githubusercontent.com/karnelian/specs-engine/master/install.ps1 | iex"

echo.
pause
