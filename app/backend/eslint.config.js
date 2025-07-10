/** @type {import('eslint').Linter.Config[]} */
module.exports = [
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: require("@typescript-eslint/parser"),
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
			},
		},
		plugins: {
			"@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
		},
		rules: {
			"@typescript-eslint/no-unused-vars": "warn",
			"prefer-const": "error",
			"no-var": "error",
		},
	},
	{
		files: ["**/*.test.ts", "**/__tests__/**/*.ts"],
		languageOptions: {
			globals: {
				describe: "readonly",
				test: "readonly",
				expect: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
				beforeAll: "readonly",
				afterAll: "readonly",
				jest: "readonly",
			},
		},
	},
]
