module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'airbnb',
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react/jsx-runtime',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/parsers': {
            '@typescript-eslint/parser': ['.js', '.jsx', '.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {},
            node: {},
        },
    },
    rules: {
        strict: 1,
        '@typescript-eslint/indent': ['error', 4, { SwitchCase: 1 }],

        'react/jsx-indent': [2, 4],
        'react/jsx-indent-props': [2, 4],
        'react/jsx-filename-extension': ['error', { extensions: ['.js', '.ts', '.jsx', '.tsx'] }],
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
    overrides: [
        {
            files: ['.js', '.jsx', '.ts', '.tsx'],
            processor: '@graphql-eslint/graphql',
        },
        {
            files: ['*.graphql'],
            extends: 'plugin:@graphql-eslint/schema-recommended',
        },
    ],
};
