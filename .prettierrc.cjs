module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  bracketSpacing: true,
  printWidth: 80,
  overrides: [
    {
      files: '*.json',
      options: {
        parser: 'json',
        trailingComma: 'es5',
      },
    },
    {
      files: '*.ts',
      options: {
        printWidth: 100,
      },
    },
    {
      files: 'LICENSE',
      options: {
        parser: 'markdown',
      },
    },
  ],
};
