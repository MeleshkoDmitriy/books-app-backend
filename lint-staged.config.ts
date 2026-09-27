// lint-staged appends the matched file paths to every command.
// `prisma format` takes --schema rather than a positional path, so that entry
// uses a function: it ignores the file list and returns a static command.
export default {
  '*.ts': ['oxlint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
  'prisma/schema.prisma': () => 'prisma format',
};
