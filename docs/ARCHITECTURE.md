# DevMail Architecture

DevMail follows **feature-based (vertical slice) architecture**: code is grouped by business capability, not by technical type. The two packages (`server/`, `client/`) are independent npm projects.

## Principles

1. Organize around business features; each feature is self-contained.
2. Every feature has a top-level `index.ts`: its public API and gatekeeper.
3. Other features import only from that `index.ts`, never from internal files.
4. Shared code lives in `shared/` only when it is genuinely reusable and feature-agnostic.
5. No abstractions without a current need; no empty folders; strict TypeScript.

## Server

```
server/src/
  app.ts                 Express app: middleware, routes, error handling
  server.ts              Entry point: DB check, start API + SMTP, graceful shutdown
  features/
    emails/              routes, controller, service, repository, schema, validation, types, index
    smtp/                server, parser, constants, index
  shared/
    config/env.ts        Zod-validated environment
    database/client.ts   Neon pool, Drizzle instance
    errors/              AppError, NotFoundError
    middleware/          error-handler, validate
  test-support/          helpers used only by tests
```

### Responsibilities

| File | Does | Must not |
| --- | --- | --- |
| `routes.ts` | Declare endpoints, attach validation middleware | Contain logic |
| `controller.ts` | Read request, call service, choose status code, shape response | Query the database, hold business rules, use `try/catch` |
| `service.ts` | Business rules, throws `AppError`s | Touch `req`/`res` or status codes |
| `repository.ts` | Drizzle queries | Handle HTTP or business rules |
| `validation.ts` | Zod schemas and inferred input types | |
| `schema.ts` | Drizzle table definition owned by the feature | |

### Public API and dependency direction

```
routes → controller → service → repository → shared/database
smtp  ──────────────→ emails/index.ts (emailService, NewEmail)
features → shared      (never shared → features)
```

The SMTP feature creates emails through `emailService.createEmail`; it never imports the emails repository. Example from `features/smtp/server.ts`:

```ts
import { emailService } from "../emails/index.js";
```

Tests live next to the code and may import a feature's internals (for example, to mock the repository).

### Error handling

Express 5 forwards rejected promises to the error handler, so controllers do not need `try/catch`. Services throw `AppError` subclasses (for example `NotFoundError`). `shared/middleware/error-handler.ts` maps `ZodError` → 400, `AppError` → its status, Express body-parser client errors → 4xx, anything else → 500 (message hidden in production). See [API.md](API.md#error-responses).

### Database access

Only repositories import `shared/database/client`. The `emails` table is defined in `features/emails/schema.ts`; `drizzle.config.ts` collects `src/features/*/schema.ts` and writes migrations to `server/drizzle/`.

### Configuration

All environment access goes through `shared/config/env.ts`; nothing else reads `process.env`.

## Client

```
client/src/
  main.tsx               Entry point
  app/                   App component, providers/QueryProvider
  features/emails/
    api.ts               Axios calls
    hooks/               React Query hooks + query keys
    components/          Inbox, EmailRow, EmailDetail
    utils/               emailPreview
    types.ts
    index.ts             public API
  shared/api/            Axios instance
  styles/                Global Tailwind CSS
```

- Server state is owned by React Query; there is no client-side store because no client-only state is shared between components (the selected email id is local state in `Inbox`).
- Components import hooks and utils from within their feature; `app/` imports only from `features/emails/index.ts`.
- The API base URL comes from `VITE_API_URL` (default `http://localhost:3000/api/v1`).

## Naming conventions

- Domain names over generic ones: `email`, `emailId`, `emailRepository`, `emailService`, `parseRawEmail`.
- Server files are lower-case role names inside the feature folder (`service.ts`, `repository.ts`); tests are `*.test.ts` beside the code.
- Client components are PascalCase files; hooks are `useXxx.ts`.
- Repository/service/controller are exported as named objects (`emailService.getEmail`).

## Adding a new feature

1. Create `server/src/features/<name>/` with only the files needed: usually `routes.ts`, `controller.ts`, `service.ts`, `repository.ts`, `validation.ts`, `types.ts`, `index.ts`. Put its Drizzle table in `schema.ts`, then run `npm run generate`.
2. Export from `index.ts` only what other features or `app.ts` need (typically the router).
3. Mount the router in `app.ts`.
4. For UI, create `client/src/features/<name>/` with `api.ts`, `hooks/`, `components/`, `types.ts`, `index.ts`, and render it from `app/`.
5. Cross-feature calls go through the other feature's `index.ts`. If that export does not exist yet, add it deliberately.
6. Add tests, update `docs/FEATURES.md` and `docs/API.md`.
