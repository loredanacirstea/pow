module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'indent': ['error', 4],
        'object-curly-spacing': ['error', 'never'],
        'object-curly-newline': 'off',
        'no-plusplus': 'off',
        'func-names': ['error', 'never'],
        'import/prefer-default-export': 'off',
        'no-console': 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
