module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
  env: {
    'jest/globals': true,
  },
  root: true,
  extends: ['@react-native-community'],
  plugins: ['jest'],
  rules: {
    semi: 0,
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'react/require-default-props': ['off'],
    'react/default-props-match-prop-types': ['error'],
    'react/sort-prop-types': ['error'],
    'react-hooks/exhaustive-deps': 'off',
    'no-extra-semi': ['off'],
    'react/no-unstable-nested-components': ['off'],
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
