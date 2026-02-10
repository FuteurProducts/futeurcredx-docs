#!/usr/bin/env bash
# Quality Gate — run before marking any task complete
# Usage: bash scripts/validate.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

echo "=== LUMIQ AI DASHBOARD — Quality Gate ==="
echo ""

# 1. TypeScript type check
echo -n "  [1/3] TypeScript (tsc --noEmit)... "
if npx tsc --noEmit 2>/dev/null; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${RED}FAIL${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 2. ESLint
echo -n "  [2/3] ESLint... "
if npx eslint . --max-warnings=0 2>/dev/null; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${YELLOW}WARN${NC} (lint warnings present)"
fi

# 3. Build check
echo -n "  [3/3] Vite build... "
if npx vite build 2>/dev/null 1>/dev/null; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${RED}FAIL${NC}"
  ERRORS=$((ERRORS + 1))
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo -e "${GREEN}=== ALL GATES PASSED ===${NC}"
  exit 0
else
  echo -e "${RED}=== ${ERRORS} GATE(S) FAILED ===${NC}"
  exit 1
fi
