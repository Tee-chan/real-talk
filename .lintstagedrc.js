module.exports = {
  '**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,md,yaml,yml}': ['prettier --write'],
  'packages/database/prisma/schema.prisma': ['prisma format'],
}
