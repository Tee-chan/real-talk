/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['node_modules/', 'dist/', '.next/', '.turbo/', 'coverage/'],
  overrides: [
    {
      files: ['apps/api/**/*.ts'],
      extends: ['./packages/eslint-config/nest.js'],
    },
    {
      files: ['apps/web/**/*.{ts,tsx}'],
      extends: ['./packages/eslint-config/next.js'],
    },
    {
      files: ['packages/**/*.ts'],
      extends: ['./packages/eslint-config/base.js'],
    },
  ],
}
