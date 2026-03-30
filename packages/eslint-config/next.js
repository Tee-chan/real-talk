/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...require('./base.js'),
  extends: [
    ...require('./base.js').extends,
    'next/core-web-vitals',
  ],
  rules: {
    ...require('./base.js').rules,
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/no-unescaped-entities': 'off',
  },
  env: { browser: true, node: true },
}
