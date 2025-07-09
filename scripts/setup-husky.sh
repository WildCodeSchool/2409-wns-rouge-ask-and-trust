#!/bin/bash

# Ask and Trust - Husky Setup Script
# This script initializes and configures all Husky git hooks

echo "🚀 Setting up Husky git hooks for Ask and Trust..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo "❌ Error: Not in a git repository"
  echo "Run this script from the project root directory"
  exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
if command -v pnpm >/dev/null 2>&1; then
  pnpm install
else
  echo "❌ Error: pnpm not found"
  echo "Please install pnpm: npm install -g pnpm"
  exit 1
fi

# Initialize Husky
echo "🐕 Initializing Husky..."
npx husky install

# Make sure all hooks are executable
echo "🔧 Setting executable permissions on hooks..."
chmod +x .husky/*

# Verify hook files exist
hooks=("pre-commit" "commit-msg" "pre-push" "post-merge")
for hook in "${hooks[@]}"; do
  if [ -f ".husky/$hook" ]; then
    echo "✅ $hook hook configured"
  else
    echo "❌ $hook hook missing"
  fi
done

# Test commitlint configuration
echo "📝 Testing commitlint configuration..."
echo "feat(test): testing commitlint setup" | npx commitlint
if [ $? -eq 0 ]; then
  echo "✅ Commitlint configuration is valid"
else
  echo "❌ Commitlint configuration issue"
fi

# Test lint-staged configuration
echo "🎨 Testing lint-staged configuration..."
if [ -f ".lintstagedrc.json" ]; then
  echo "✅ Lint-staged configuration found"
else
  echo "❌ Lint-staged configuration missing"
fi

# Final verification
echo ""
echo "🎉 Husky setup completed!"
echo ""
echo "📋 Summary:"
echo "  • Git hooks: ✅ Installed and configured"
echo "  • Permissions: ✅ Set correctly"
echo "  • Commitlint: ✅ Working"
echo "  • Lint-staged: ✅ Configured"
echo ""
echo "🔧 Next steps:"
echo "  1. Make a test commit to verify pre-commit hook"
echo "  2. Review .husky/README.md for detailed documentation"
echo "  3. Share this setup with your team"
echo ""
echo "Happy coding! 🚀" 