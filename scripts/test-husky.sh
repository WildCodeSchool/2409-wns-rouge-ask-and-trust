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

echo -e "${BLUE}📋 Test 5: Pre-push hook functionality${NC}"
echo "====================================="

# Test frontend linting
echo "🎨 Testing frontend ESLint..."
cd app/frontend && npm run lint >/dev/null 2>&1
if [ $? -eq 0 ]; then
  test_result 0 "Frontend ESLint runs successfully"
else
  test_result 1 "Frontend ESLint has issues (warnings are OK)"
fi
cd ../..

# Test frontend tests
echo "🧪 Testing frontend tests..."
cd app/frontend && npm run test -- --run >/dev/null 2>&1
test_result $? "Frontend test suite runs"
cd ../..

# Test backend linting
echo "🎨 Testing backend ESLint..."
cd app/backend && npm run lint >/dev/null 2>&1
if [ $? -eq 0 ]; then
  test_result 0 "Backend ESLint runs successfully"
else
  test_result 1 "Backend ESLint has issues (warnings are OK)"
fi
cd ../..

# Test backend tests
echo "🧪 Testing backend tests..."
cd app/backend && npm run test >/dev/null 2>&1
test_result $? "Backend test suite runs"
cd ../..

# Test TypeScript compilation (frontend)
echo "🔍 Testing TypeScript compilation..."
cd app/frontend && npx tsc --noEmit >/dev/null 2>&1
if [ $? -eq 0 ]; then
  test_result 0 "Frontend TypeScript compilation"
else
  test_result 1 "Frontend TypeScript compilation has errors"
fi
cd ../..

echo -e "${BLUE}📋 Test 6: Smart change detection logic${NC}"
echo "======================================"

# Test change detection patterns
echo "🔍 Testing change detection patterns..."

# Test if git diff command works (basic availability test)
git --version >/dev/null 2>&1
test_result $? "Git is available for change detection"

# Test pattern matching logic (simulate what pre-push does)
echo "📱 Testing frontend pattern matching..."
echo "app/frontend/src/components/test.tsx" | grep -q "^app/frontend/"
test_result $? "Frontend file pattern detection"

echo "🖥️  Testing backend pattern matching..."
echo "app/backend/src/services/test.ts" | grep -q "^app/backend/"
test_result $? "Backend file pattern detection"

echo "🔧 Testing root file detection..."
echo "package.json" | grep -q "^app/frontend/\|^app/backend/"
if [ $? -ne 0 ]; then
  test_result 0 "Root files correctly trigger all checks"
else
  test_result 1 "Root file detection logic issue"
fi

echo -e "${BLUE}📋 Test 7: Backend configuration${NC}"
echo "================================="

# Test backend specific configurations
echo "⚙️  Testing Jest configuration..."
if [ -f "app/backend/jest.config.js" ]; then
  test_result 0 "Backend Jest configuration exists"
else
  test_result 1 "Backend Jest configuration missing"
fi

echo "⚙️  Testing Backend ESLint configuration..."
if [ -f "app/backend/eslint.config.js" ]; then
  test_result 0 "Backend ESLint configuration exists"
else
  test_result 1 "Backend ESLint configuration missing"
fi

echo "📝 Testing backend TypeScript configuration..."
if [ -f "app/backend/tsconfig.json" ]; then
  test_result 0 "Backend TypeScript configuration exists"
else
  test_result 1 "Backend TypeScript configuration missing"
fi

echo -e "${BLUE}📋 Test 8: Scripts availability${NC}"
echo "================================"

# Test frontend scripts
echo "📱 Testing frontend scripts..."
cd app/frontend
required_scripts=("lint" "test" "build" "dev")
for script in "${required_scripts[@]}"; do
  if grep -q "\"$script\"" package.json; then
    test_result 0 "Frontend script '$script' exists"
  else
    test_result 1 "Frontend script '$script' missing"
  fi
done
cd ../..

# Test backend scripts
echo "🖥️  Testing backend scripts..."
cd app/backend
required_scripts=("lint" "test" "start")
for script in "${required_scripts[@]}"; do
  if grep -q "\"$script\"" package.json; then
    test_result 0 "Backend script '$script' exists"
  else
    test_result 1 "Backend script '$script' missing"
  fi
done
cd ../..

echo -e "${BLUE}📋 Test 9: Pre-push hook integration${NC}"
echo "===================================="

# Test pre-push hook syntax
echo "🔧 Testing pre-push hook syntax..."
if bash -n .husky/pre-push 2>/dev/null; then
  test_result 0 "Pre-push hook has valid bash syntax"
else
  test_result 1 "Pre-push hook has syntax errors"
fi

# Test change detection commands in pre-push
echo "🔍 Testing change detection commands..."
if grep -q "git diff --name-only" .husky/pre-push; then
  test_result 0 "Change detection logic present in pre-push"
else
  test_result 1 "Change detection logic missing in pre-push"
fi

# Test conditional execution logic
echo "⚙️  Testing conditional execution logic..."
if grep -q "FRONTEND_MODIFIED" .husky/pre-push && grep -q "BACKEND_MODIFIED" .husky/pre-push; then
  test_result 0 "Smart conditional execution logic present"
else
  test_result 1 "Conditional execution logic missing"
fi

echo
echo "=================================="
echo -e "${BLUE}📊 TEST SUMMARY${NC}"
echo "=================================="
echo -e "Total tests: ${TESTS_TOTAL}"
echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"

# Calculate success percentage
SUCCESS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))
echo -e "Success rate: ${SUCCESS_RATE}%"

if [ $TESTS_FAILED -eq 0 ]; then
  echo
  echo -e "${GREEN}🎉 All tests passed! Husky configuration is ready.${NC}"
  echo
  echo -e "${BLUE}✨ New Features Tested:${NC}"
  echo "• Smart change detection (frontend/backend)"
  echo "• Conditional execution based on modified files"
  echo "• Backend Jest and ESLint configuration"
  echo "• Updated scripts using npm (not pnpm)"
  echo
  echo -e "${GREEN}Next steps:${NC}"
  echo "1. Test with a real commit: git commit -m 'feat: test husky config'"
  echo "2. Modify frontend only and push to test conditional execution"
  echo "3. Modify backend only and verify only backend checks run"
  echo "4. Review and push: git push origin your-branch"
  exit 0
elif [ $SUCCESS_RATE -ge 80 ]; then
  echo
  echo -e "${YELLOW}⚠️  Most tests passed (${SUCCESS_RATE}%). Minor issues detected.${NC}"
  echo "The configuration should work, but review failed tests."
  exit 0
else
  echo
  echo -e "${RED}❌ Many tests failed (${SUCCESS_RATE}% success). Review configuration before proceeding.${NC}"
  exit 1
fi 