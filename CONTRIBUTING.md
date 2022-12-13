## Development Workflow
1. Fork the project and clone it
2. Installation dependency: `pnpm install` or `pnpm`
3. Create a `.env.local` file and copy all values from `.env.example` and add all necessary entries
    ```
    VITE_GRAPHQL_API_ENDPOINT=http://localhost:8000/graphql/
    VITE_GRAPHQL_CODEGEN_ENDPOINT=http://localhost:8000/graphql/
    ```
4. Commit your changes, and please follow [Commitlint Git Commit Message Conventions] (<https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional>)

## Development Scripts

- `pnpm dev` - start a development server with hot reload
- `pnpm build` - build for production. The generated files will be on the `dist` folder
- `pnpm preview` - locally preview the production build
- `pnpm test` - run unit and integration tests related to changed files based on git
- `pnpm lint` - runs `ESLint`
- `pnpm stylelint` - runs `Stylelint`
- `pnpm typecheck` - runs `typescript` type check
- `pnpm codegen` - runs `graphql-codegen` to generate code from GraphQL schema and GraphQL operations
