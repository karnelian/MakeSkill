#!/bin/bash
# specs-engine v5.3 원격 설치 스크립트 (Mac/Linux)
#
# 사용법 (원라이너):
#   curl -fsSL https://raw.githubusercontent.com/karnelian/specs-engine/master/install.sh | bash
#
# 또는 로컬:
#   bash install.sh

set -e

REPO_URL="https://github.com/karnelian/specs-engine.git"
INSTALL_DIR="$HOME/.claude/specs-engine"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  specs-engine v5.3 자동 설치"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. git 확인
if ! command -v git &> /dev/null; then
    echo "❌ git이 설치되어 있지 않습니다."
    echo "   먼저 설치하세요:"
    echo "     Mac:   brew install git"
    echo "     Linux: sudo apt install git"
    exit 1
fi

# 2. 이미 설치됨 확인
if [ -d "$INSTALL_DIR" ]; then
    echo "⚠️  이미 설치되어 있습니다: $INSTALL_DIR"
    read -p "업데이트할까요? (y/N) " answer
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        echo "🔄 git pull 중..."
        cd "$INSTALL_DIR" && git pull
    else
        echo "취소됨."
        exit 0
    fi
else
    # 3. 클론
    echo "📥 클론 중: $REPO_URL"
    mkdir -p "$HOME/.claude"
    git clone "$REPO_URL" "$INSTALL_DIR"
fi

# 4. setup.sh 실행
echo ""
echo "⚙️  setup.sh 실행 중..."
bash "$INSTALL_DIR/setup.sh"

echo ""
echo "🎉 설치 완료! 아무 프로젝트에서 '/product-spec' 을 입력하세요."
echo ""
