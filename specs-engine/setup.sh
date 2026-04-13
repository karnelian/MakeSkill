#!/bin/bash
# specs-engine v5.3 설치 스크립트
# 사용법: git clone <repo> ~/.claude/specs-engine && bash ~/.claude/specs-engine/setup.sh

INSTALL_DIR="$HOME/.claude/specs-engine"
COMMANDS_DIR="$HOME/.claude/commands"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  specs-engine v5.3 설치"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. ~/.claude/ 디렉토리 확인
mkdir -p "$HOME/.claude"
mkdir -p "$COMMANDS_DIR"

# 2. 클론 위치가 ~/.claude/specs-engine이 아니면 심링크
if [ "$SCRIPT_DIR" != "$INSTALL_DIR" ]; then
  if [ -d "$INSTALL_DIR" ]; then
    echo "⚠️  이미 $INSTALL_DIR 에 설치되어 있습니다."
    echo "   업데이트: cd $INSTALL_DIR && git pull"
    echo "   재설치: rm -rf $INSTALL_DIR 후 다시 실행"
    exit 0
  fi
  echo "📁 심볼릭 링크 생성: $INSTALL_DIR -> $SCRIPT_DIR"
  ln -sf "$SCRIPT_DIR" "$INSTALL_DIR"
fi

# 3. Commands 설치 (product-spec, company-profile)
for cmd in "$INSTALL_DIR/commands/"*.md; do
  [ -f "$cmd" ] || continue
  name=$(basename "$cmd")
  if [ -f "$COMMANDS_DIR/$name" ]; then
    echo "🔄 commands/$name 업데이트"
  else
    echo "📋 commands/$name 설치"
  fi
  cp "$cmd" "$COMMANDS_DIR/$name"
done

echo ""
echo "✅ 설치 완료!"
echo ""
echo "사용법:"
echo "  1. 아무 프로젝트 폴더에서 Claude Code 실행"
echo "  2. '/product-spec' 또는 '기획서 만들어줘' 입력"
echo ""
echo "업데이트:"
echo "  cd ~/.claude/specs-engine && git pull && bash setup.sh"
echo ""
