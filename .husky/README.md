# Husky Git Hooks - Simple Configuration

Simplified and robust Git hooks configuration to maintain code quality.

## 🔧 Configured Hooks

### `pre-commit` - Quick Checks
- ✅ **Type checking** (frontend TypeScript)
- ✅ **Lint-staged** (Prettier on modified files)
- ⚡ **Performance**: ~10-30 seconds

### `commit-msg` - Conventional Messages
- ✅ **Format**: `type(scope): description`
- ✅ **Types**: feat, fix, docs, style, refactor, perf, test, chore, revert, ci, build
- ✅ **Flexibility**: Free case in subject

### `pre-push` - Complete Validation  
- ✅ **Complete type checking**
- ✅ **Complete linting**
- ✅ **Tests** with Vitest
- ✅ **Build** verification
- ⚡ **Performance**: ~1-3 minutes

### `post-merge` - Automation
- ✅ **Notification** of dependency changes
- ✅ **Lightweight** and non-intrusive

## 🚀 Usage

### Commit Messages
```bash
# ✅ Valid
feat: add user authentication
fix(api): resolve memory leak
docs: update README installation steps
chore: update dependencies

# ❌ Invalid  
add stuff
fix bug
WIP
```

### Simple Workflow
```bash
# 1. Normal development
git add .
git commit -m "feat: new feature"  # Hooks run automatically

# 2. Push (complete validation)
git push origin branch-name  # Tests + build + complete lint
```

## ⚙️ Configuration

### Key Files
- `.husky/pre-commit` - Quick checks
- `.husky/commit-msg` - Message validation
- `.husky/pre-push` - Complete tests
- `.lintstagedrc.json` - Lint-staged configuration
- `commitlint.config.js` - Commit rules

### Available Scripts
```bash
# From root
npm run lint           # Frontend ESLint
npm run lint:fix       # ESLint with auto-fix
npm run type-check     # Complete type checking
npm run test           # Frontend tests
npm run build          # Backend build
npm run build:frontend # Frontend build

# In app/frontend/
npm run lint        # ESLint
npm run test        # Vitest tests  
npm run build       # Vite build
npx tsc --noEmit    # Type checking
```

## 🛠️ Troubleshooting

### Temporary skip (emergency only)
```bash
git commit --no-verify -m "hotfix: critical fix"
git push --no-verify
```

### Common Issues
- **ESLint errors** → Configure IDE with ESLint
- **Type errors** → Check TypeScript imports/exports
- **Tests failing** → Fix before commit

### Automatic stash
If lint-staged creates automatic stashes:
```bash
git stash list      # View stashes
git stash drop 0    # Clean up if necessary
```
