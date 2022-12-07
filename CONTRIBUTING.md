## Pull Request
1. Fork the project and clone it
2. Installation dependency: `pnpm install` or `pnpm`
3. Commit your changes, and please follow [Commitlint Git Commit Message Conventions] (<https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional>)

## Development Process

- `pnpm dev` - start a development server with hot reload
- `pnpm build` - build for production. The generated files will be on the `dist` folder
- `pnpm preview` - locally preview the production build
- `pnpm test` - run unit and integration tests related to changed files based on git
- `pnpm lint` - runs `ESLint`
- `pnpm stylelint` - runs `Stylelint`
- `pnpm typecheck` - runs `typescript` type check
- `pnpm codegen` - runs `graphql-codegen` to generate code from GraphQL schema and GraphQL operations
