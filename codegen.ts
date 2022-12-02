import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: import.meta.env.VITE_GRAPHQL_API_ENDPOINT,
    documents: 'src/**/*.tsx',
    ignoreNoDocuments: true,
    generates: {
        'src/gql': {
            preset: 'client',
            plugins: [],
        },
    },
};

export default config;
