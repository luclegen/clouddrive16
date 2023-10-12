module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'google',
    'plugin:react/recommended',
    'prettier'
  ],
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'require-jsdoc': 'off',
    'react/react-in-jsx-scope': 'off',
    eqeqeq: 'off',
    curly: 'error',
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    indent: ['error', 2],
    'no-multiple-empty-lines': 'error',
    'semi-style': ['error', 'last'],
    'space-before-blocks': ['error', 'always'],
    camelcase: 'off',
    'react/prop-types': 'off'
  }
};
