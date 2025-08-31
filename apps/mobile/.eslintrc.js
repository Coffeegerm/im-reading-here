// ESLint config for mobile app
module.exports = {
  root: true,
  extends: [
    'expo',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  plugins: ['import'],
  rules: {
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
          'type'
        ],
        'newlines-between': 'always',
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
      }
    ]
  }
};
