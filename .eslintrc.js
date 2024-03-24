module.exports = {
    extends: [
        'eslint:recommended', 
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: 'tsconfig.json',
    },
    env: {
        es6: true,
        node: true,
    },
    rules: {
        "no-unsafe-optional-chaining": 0,
        "@typescript-eslint/no-explicit-any": "warn",
        "no-unused-vars": 0,
        "@typescript-eslint/no-unused-vars": "warn",
        indent: ['error', 2, { SwitchCase: 1 }],
        'no-multi-spaces': 'error',
        'space-in-parens': 'error',
        'no-multiple-empty-lines': 'error',
        'prefer-const': 'error',
    }
};