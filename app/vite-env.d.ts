/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    readonly VITE_GRAPHQL_API_ENDPOINT: string
    readonly VITE_GRAPHQL_CODEGEN_ENDPOINT: string
    readonly VITE_SENTRY_DSN: string
    readonly VITE_SENTRY_TRACES_SAMPLE_RATE: string
    readonly VITE_SENTRY_DEBUG: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface CSSModuleClasses {
    [key: string]: string
}
