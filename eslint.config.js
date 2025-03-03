import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
  },
  {
    ignores: ['node_modules/', 'dist/', 'src/assets/'],
  },
  {
    languageOptions: { globals: globals.browser }
  },
  {
    ...pluginJs.configs.recommended,
  },
  {
    ...tseslint.configs.base,
  },
  {
    rules: {
      'semi': ['error', 'always'],
      '@typescript-eslint/no-unused-vars': ['warn'],
      'no-undef': ['off'],
      'no-unused-vars': ['off'],
      'object-curly-spacing': ['error', 'always'], // {} 内部两边空格[8,9](@ref)
      'space-in-parens': ['error', 'never'], // () 内部不留空格[9](@ref)
      'array-bracket-spacing': ['error', 'never'], // [] 内部不留空格[9](@ref)
    },
  }
];
