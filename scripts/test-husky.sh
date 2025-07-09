#!/bin/bash

# Test Husky Configuration Script
# Tests all hooks without actually committing/pushing

echo "🔧 Testing Husky Configuration..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

test_result() {
  TESTS_TOTAL=$((TESTS_TOTAL + 1))
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $2"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}❌ FAIL${NC}: $2"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
  echo
}

echo -e "${BLUE}📋 Test 1: Hook files exist and are executable${NC}"
echo "================================================="

# Test hook files existence and permissions
for hook in "pre-commit" "commit-msg" "pre-push" "post-merge"; do
  if [ -f ".husky/$hook" ] && [ -x ".husky/$hook" ]; then
    test_result 0 "Hook $hook exists and is executable"
  else
    test_result 1 "Hook $hook missing or not executable"
  fi
done

echo -e "${BLUE}📋 Test 2: Configuration files exist${NC}"
echo "====================================="

# Test configuration files
config_files=(".lintstagedrc.json" "commitlint.config.js")
for file in "${config_files[@]}"; do
  if [ -f "$file" ]; then
    test_result 0 "Configuration file $file exists"
  else
    test_result 1 "Configuration file $file missing"
  fi
done

echo -e "${BLUE}📋 Test 3: Commitlint validation${NC}"
echo "================================"

# Test valid commit messages
valid_messages=(
  "feat: add new feature"
  "fix(api): resolve bug"
  "docs: update README"
  "chore: update dependencies"
)

for msg in "${valid_messages[@]}"; do
  echo "$msg" | npx commitlint >/dev/null 2>&1
  test_result $? "Valid commit message: '$msg'"
done

# Test invalid commit messages
invalid_messages=(
  "random message"
  "fix bug"
  "WIP"
)

for msg in "${invalid_messages[@]}"; do
  echo "$msg" | npx commitlint >/dev/null 2>&1
  if [ $? -ne 0 ]; then
    test_result 0 "Invalid commit message correctly rejected: '$msg'"
  else
    test_result 1 "Invalid commit message incorrectly accepted: '$msg'"
  fi
done

echo -e "${BLUE}📋 Test 4: Lint-staged configuration${NC}"
echo "===================================="

# Test lint-staged config existence and basic syntax
if [ -f ".lintstagedrc.json" ]; then
  # Simple syntax check with node
  if node -e "JSON.parse(require('fs').readFileSync('.lintstagedrc.json', 'utf8'))" 2>/dev/null; then
    test_result 0 "Lint-staged configuration file is valid JSON"
  else
    test_result 1 "Lint-staged configuration has JSON syntax errors"
  fi
else
  test_result 1 "Lint-staged configuration file missing"
fi

echo -e "${BLUE}📋 Test 5: Pre-commit hook simulation${NC}"
echo "====================================="

# Simulate pre-commit (without git operations)
echo "🔍 Simulating type check..."
cd app/frontend && npx tsc --noEmit >/dev/null 2>&1
if [ $? -eq 0 ]; then
  test_result 0 "TypeScript compilation check"
else
  test_result 1 "TypeScript compilation has errors (expected during config)"
fi
cd ../..

# Test if eslint can run
echo "🎨 Testing ESLint..."
cd app/frontend && npx eslint --version >/dev/null 2>&1
test_result $? "ESLint is available"
cd ../..

echo -e "${BLUE}📋 Test 6: Scripts availability${NC}"
echo "================================"

# Test if required scripts exist in package.json
cd app/frontend
if grep -q '"lint"' package.json; then
  test_result 0 "Frontend script 'lint' exists"
else
  test_result 1 "Frontend script 'lint' missing"
fi

if grep -q '"test"' package.json; then
  test_result 0 "Frontend script 'test' exists"
else
  test_result 1 "Frontend script 'test' missing"
fi

if grep -q '"build"' package.json; then
  test_result 0 "Frontend script 'build' exists"
else
  test_result 1 "Frontend script 'build' missing"
fi
cd ../..

echo
echo "=================================="
echo -e "${BLUE}📊 TEST SUMMARY${NC}"
echo "=================================="
echo -e "Total tests: ${TESTS_TOTAL}"
echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo
  echo -e "${GREEN}🎉 All tests passed! Husky configuration is ready.${NC}"
  echo
  echo "Next steps:"
  echo "1. Test with a real commit: git commit -m 'feat: test husky config'"
  echo "2. Review and push: git push origin your-branch"
  exit 0
else
  echo
  echo -e "${YELLOW}⚠️  Some tests failed. Review the configuration before proceeding.${NC}"
  exit 1
fi 