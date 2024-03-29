### Development
Install all project dependencies

```
pnpm install
```

Create a `.env.local` file and copy all values from `.env.example` and add all necessary entries

```
VITE_GRAPHQL_API_ENDPOINT=http://localhost:8000/graphql/
VITE_GRAPHQL_CODEGEN_ENDPOINT=http://localhost:8000/graphql/
VITE_SENTRY_DSN=https://9a60f35c6a1c45fe999727c5f6f7229c@o158798.ingest.sentry.io/1220157,
VITE_SENTRY_TRACES_SAMPLE_RATE=1
```

```bash
pnpm dev
```

visit http://localhost:5173

### Build

To build the App, run

```bash
pnpm build
```
To preview the build
```bash
pnpm preview
```
### Scripts

- `pnpm dev` - start a development server with hot reload
- `pnpm build` - build for production. The generated files will be on the `dist` folder
- `pnpm preview` - locally preview the production build
- `pnpm test` - run unit and integration tests related to changed files based on git
- `pnpm lint` - runs `ESLint`
- `pnpm stylelint` - runs `Stylelint`
- `pnpm typecheck` - runs `typescript` type check
- `pnpm codegen` - runs `graphql-codegen` to generate code from GraphQL schema and GraphQL operations
