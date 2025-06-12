export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting, missing semicolons, etc.
        'refactor', // Code refactoring
        'perf', // Performance improvement
        'test', // Adding or modifying tests
        'chore', // Maintenance, dependencies, etc.
        'revert', // Reverting changes
        'ci', // CI/CD configuration
        'build', // Build system or external dependencies
      ],
    ],
    'type-case': [2, 'always', ['lower-case', 'upper-case', 'sentence-case']],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', ['lower-case', 'upper-case', 'sentence-case']],
    'subject-case': [2, 'always', ['lower-case', 'upper-case', 'sentence-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 255],
  },
};
