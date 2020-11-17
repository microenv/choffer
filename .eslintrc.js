module.exports = {
  extends: [
    'react-app',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: '999.999.999',
    },
  },
  rules: {
    'prettier/prettier': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'array-callback-return': 'off',
  },
};
