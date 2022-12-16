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
        'import/resolver': {
            typescript: {
                directory: './tsconfig.json',
            },
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    rules: {
        'no-shadow': 0,
        '@typescript-eslint/no-shadow': ['error'],

        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,

        'no-console': 1,
        indent: ['error', 4, { SwitchCase: 1 }],
        'react/jsx-indent': [2, 4],
        'react/jsx-indent-props': [2, 4],
        '@typescript-eslint/indent': ['error', 4],
        'import/extensions': ['off', 'never'],
        'prefer-destructuring': 'warn',
        'function-paren-newline': ['warn', 'consistent'],
        'object-curly-newline': [2, {
            ObjectExpression: { consistent: true },
            ObjectPattern: { consistent: true },
            ImportDeclaration: { consistent: true },
            ExportDeclaration: { consistent: true },
        }],

        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

        'jsx-a11y/anchor-is-valid': ['error', {
            components: ['Link'],
            specialLink: ['to'],
        }],
        'jsx-a11y/label-has-for': 'warn',

        'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'react/jsx-props-no-spreading': 0,
        'react/jsx-key': ['warn', {
            checkFragmentShorthand: true,
            checkKeyMustBeforeSpread: true,
        }],

        'react/prop-types': [1, { ignore: [], customValidators: [], skipUndeclared: false }],
        'react/forbid-prop-types': [1],
        'react/destructuring-assignment': [1, 'always', { ignoreClassFields: true }],
        'react/require-default-props': ['warn', { ignoreFunctionalComponents: true }],
        'react/sort-comp': [1, {
            order: [
                'static-methods',
                'constructor',
                'lifecycle',
                'everything-else',
                'render',
            ],
        }],
        'react/no-unused-state': 'warn',
        'react/default-props-match-prop-types': ['warn', {
            allowRequiredDefaults: true,
        }],

        'react/function-component-definition': [2, {
            namedComponents: 'function-declaration',
            unnamedComponents: 'function-expression',
        }],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
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
