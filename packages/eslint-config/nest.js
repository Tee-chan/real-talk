/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...require('./base.js'),
  env: { node: true },
  rules: {
    ...require('./base.js').rules,
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
  },
}
