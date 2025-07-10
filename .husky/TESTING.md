# Testing Guide - Husky Configuration

Practical guide to test and validate the Husky configuration before pushing.

## 🚀 Automated Quick Test

```bash
# Complete test script
./scripts/test-husky.sh
```

This script automatically tests:
- ✅ Hook existence and permissions
- ✅ Configuration files
- ✅ Commitlint validation
- ✅ Lint-staged
- ✅ Available tools

## 🔧 Manual Tests

### 1. Test Pre-Commit Hook

```bash
# Modify a file to trigger lint-staged
echo "// Test comment" >> app/frontend/src/App.tsx
git add app/frontend/src/App.tsx

# Test commit (hooks execute)
git commit -m "feat: test pre-commit hook"
```

**Expected result:**
- ✅ Type checking runs
- ✅ Lint-staged formats code
- ✅ Commit succeeds

### 2. Test Commit-msg Hook

```bash
# Valid messages (should pass)
git commit --allow-empty -m "feat: add new feature"
git commit --allow-empty -m "fix(api): resolve bug"
git commit --allow-empty -m "docs: update README"

# Invalid messages (should fail)
git commit --allow-empty -m "random message"  # ❌ Should fail
git commit --allow-empty -m "fix bug"         # ❌ Should fail
```

### 3. Test Pre-Push Hook (Config Mode)

```bash
# Pre-push is in "Husky config" mode (skip TypeScript)
git push origin your-branch
```

**Expected result:**
- ⚠️ TypeScript skipped (config mode)
- ✅ Linting passes
- ⚠️ Tests/build may fail (config mode)
- ✅ Push allowed

### 4. Test Post-Merge Hook

```bash
# Simulate a merge
git checkout main
git merge your-husky-branch --no-ff
```

**Expected result:**
- ✅ Notification of dependency changes

## 📋 Validation Checklist

### Configuration Files ✅
- [ ] `.husky/pre-commit` exists and executable
- [ ] `.husky/commit-msg` exists and executable  
- [ ] `.husky/pre-push` exists and executable
- [ ] `.husky/post-merge` exists and executable
- [ ] `.lintstagedrc.json` configured
- [ ] `commitlint.config.js` configured

### Functional Hooks ✅
- [ ] Pre-commit: type check + lint-staged
- [ ] Commit-msg: conventional commits validation
- [ ] Pre-push: linting + tests (config mode)
- [ ] Post-merge: notifications

### Commit Messages ✅
- [ ] `feat:` accepted
- [ ] `fix(scope):` accepted
- [ ] `docs:` accepted
- [ ] `random message` rejected
- [ ] `WIP` rejected

## 🎯 Complete Test Scenarios

### Scenario 1: Developer Clones Repo
```bash
git clone <repo>
cd repo
npm install  # Hooks installed automatically
git commit --allow-empty -m "feat: test setup"  # Should work
```

### Scenario 2: Commit with Format Errors
```bash
# Introduce deliberate format error
echo "const test= 'bad format' ;" >> app/frontend/src/test.ts
git add app/frontend/src/test.ts
git commit -m "feat: test formatting"
# Result: lint-staged should auto-correct
```

### Scenario 3: Invalid Commit Message
```bash
git commit --allow-empty -m "fixed stuff"
# Result: commit-msg should reject with help message
```

## 🚨 Temporary Configuration Mode

**IMPORTANT**: Pre-push is currently in "configuration mode":

```bash
# In .husky/pre-push
echo "⚠️  TEMPORARY: Skipping TypeScript checks (Husky config mode)"
```

### Restore Production Mode

Once Husky config is merged, restore complete pre-push:

```bash
# Replace .husky/pre-push with strict version
# Remove "Husky config mode" mentions
# Reactivate complete TypeScript checks
```

## 💡 Testing Tips

### Iterative Testing
1. **Automated test**: `./scripts/test-husky.sh`
2. **Manual test**: simple commit
3. **Push test**: verify it passes in config mode
4. **Team validation**: share config

### Temporary Bypass (if necessary)
```bash
# Skip pre-commit (emergency only)
git commit --no-verify -m "hotfix: critical fix"

# Skip pre-push (discouraged)
git push --no-verify
```

### Debug Hook
```bash
# See execution details
bash -x .husky/pre-commit

# Test lint-staged manually
npx lint-staged
```

## ✅ Final Validation

Before merging configuration:
1. ✅ Test script passes completely
2. ✅ Commits and push work 
3. ✅ Documentation up to date
4. ✅ Team informed of workflow
5. ✅ Plan production mode restoration
