/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    readonly VITE_GRAPHQL_API_ENDPOINT: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface CSSModuleClasses {
    [key: string]: string
}
