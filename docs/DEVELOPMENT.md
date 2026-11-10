# Development Guide

## Prerequisites

- Node.js 22 and npm
- A Neon (PostgreSQL) database. The server uses `@neondatabase/serverless`; other PostgreSQL setups are untested.

## Local setup

```bash
(cd server && npm install)
(cd client && npm install)
cp server/.env.example server/.env    # set DATABASE_URL
cp client/.env.example client/.env    # optional
```

There is one example env file per package (there is no root `.env`): [`server/.env.example`](../server/.env.example) and [`client/.env.example`](../client/.env.example).

### Server variables

| Variable | Default | Required | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | – | yes | Process exits at startup if missing |
| `NODE_ENV` | `development` | no | `production` hides internal error messages |
| `API_HOST`, `API_PORT` | `0.0.0.0`, `3000` | no | |
| `SMTP_HOST`, `SMTP_PORT` | `0.0.0.0`, `1025` | no | |

### Client variables

| Variable | Default | Notes |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api/v1` | Must include `/api/v1`; read at build time |

## Database and migrations

Schema source of truth: `server/src/features/emails/schema.ts`.

```bash
cd server
npm run generate   # create a new SQL migration in server/drizzle after editing a schema
npm run migrate    # apply pending migrations
npm run push       # alternative for throwaway databases: sync schema without migration files
```

`generate` does not connect to the database but still needs `DATABASE_URL` set (the Drizzle config reads the validated environment); any placeholder value works. Do not mix `push` and `migrate` on the same database: the initial migration creates `emails` and fails if it already exists.

## Running

```bash
cd server && npm run dev     # API on :3000, SMTP on :1025
cd client && npm run dev     # dashboard on :5173
```

Send a test message with any SMTP client pointed at `localhost:1025` (see the Nodemailer example in the [README](../README.md#point-your-application-at-devmail)).

## Testing

```bash
cd server
npm test            # node:test via tsx, no database required
npm run typecheck   # includes test files
```

- API tests start the real Express app on an ephemeral port and mock `emailRepository` methods.
- SMTP tests start the real SMTP server on port 0 and speak SMTP over a socket (`src/test-support/smtp-client.ts`).
- Each test file imports `src/test-support/env.ts` first; it sets a placeholder `DATABASE_URL`, so tests never touch a real database even if `server/.env` exists.
- Not covered: queries against a real PostgreSQL database, and the client (no test runner configured).

## Build

```bash
cd server && npm run build && npm start   # tsc -p tsconfig.build.json → dist/ (tests excluded)
cd client && npm run build                # tsc -b && vite build → dist/
cd client && npm run lint
```

CI (`.github/workflows/ci.yml`) runs typecheck, tests and build for the server, and lint and build for the client.

## Debugging

- Server logs every captured email id and subject; SMTP failures are logged with the underlying error and returned to the sending client as an SMTP error.
- `GET /health` confirms the API is up. The process exits at startup if the database cannot be reached.
- If the dashboard shows "Failed to connect to DevMail backend", check `VITE_API_URL` and that the API is running.
- `smtp-server` logs a warning about its built-in TLS certificate; STARTTLS is offered but DevMail is intended for plain connections.

## Contribution workflow

1. Branch from `main` (`feature/...`, `fix/...`, `refactor/...`).
2. Keep features self-contained; cross-feature imports go through `index.ts` ([ARCHITECTURE.md](ARCHITECTURE.md)).
3. Add or update tests for behavior changes; run the checks above.
4. Update the docs when behavior, endpoints or env variables change.
5. Use Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`), small and focused.
