const expo = require('eslint-config-expo/flat');

const declaracoes = ['class', 'const', 'export', 'function', 'let', 'var'];

module.exports = [
  ...expo,
  { ignores: ['dist/**', '.expo/**', 'nativewind-env.d.ts'] },
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'import/newline-after-import': 'error',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: declaracoes, next: declaracoes },
        { blankLine: 'always', prev: declaracoes, next: 'multiline-expression' },
        { blankLine: 'always', prev: '*', next: ['class', 'export', 'function', 'if', 'return'] },
        { blankLine: 'always', prev: ['class', 'export', 'function', 'if'], next: '*' },
      ],
    },
  },
];
