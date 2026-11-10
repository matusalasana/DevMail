# DevMail Architecture Audit

Audit of the repository as it existed on `main` at commit `a5a3874`, before any refactoring.
Everything below was verified by reading the code and running the existing tooling.
Items are labelled **Problem** (a real defect or violation) or **Recommendation** (optional improvement).

## 1. Current architecture overview

DevMail is two independent npm packages (no workspace root):

- `server/` – a single Node process that starts an Express REST API and an SMTP server.
  Incoming SMTP messages are parsed with `mailparser` and written to PostgreSQL via Drizzle ORM.
- `client/` – a Vite + React single-page app that lists captured emails and shows one email at a time.

Server layout (pre-refactor):

```
server/src/
  app.ts, server.ts
  config/env.ts            zod-validated environment
  db/index.ts              Neon pool + drizzle instance
  db/schema/emails.ts      emails table
  middleware/              asyncHandler, error-handler
  modules/emails/          routes, controller, service, repository
  smtp/smtp.server.ts      SMTP server
```

Client layout (pre-refactor): technical folders (`components/`, `hooks/`, `api/`, `types/`) with
all emails logic spread across them and the inbox UI living in `App.tsx`.

## 2. Existing feature inventory

| Feature | Where | State |
| --- | --- | --- |
| SMTP capture | `server/src/smtp/` | Works; parses and stores `from`, first `to`, `subject`, text and HTML body |
| Email storage / REST API | `server/src/modules/emails/` | List, get, create, delete one, delete all |
| Inbox UI | `client/src` | List, open one email, HTML (iframe) / text tabs |

## 3. Verified technology stack

- Server: Node.js (ESM), TypeScript (strict), Express 5, `smtp-server`, `mailparser`, Zod 4,
  Drizzle ORM + `@neondatabase/serverless` (PostgreSQL), `tsx` for development, `drizzle-kit` for migrations.
- Client: React 19, TypeScript 6, Vite 8, TanStack React Query 5, Axios, React Router (dependency only, unused),
  Tailwind CSS 4.
- Baseline checks before changes: `tsc --noEmit` (server) passes, `npm run build` and `npm run lint` (client) pass.

## 4. Architectural violations

**Problems**

1. `smtp/smtp.server.ts` imports `modules/emails/email.repository.js` directly, bypassing the emails
   service and any public API (cross-feature deep import, and a repository used outside its feature).
2. The email schema lives in a global `db/schema/` folder rather than with the feature that owns it.
3. `email.repository.ts` and `email.service.ts` accept `any`; no feature-level types or validation exist.
4. The controller (`getEmail`) decides the 404 response itself while `deleteEmail` never does; error
   handling is inconsistent and there is no typed application error.
5. No feature `index.ts`; nothing marks what is public.
6. `smtp.server.ts` and `server.ts` read `process.env` directly instead of using the validated `config/env.ts`.
7. Client: all emails code is in global technical folders; `App.tsx` contains the inbox feature's UI;
   `main.tsx` exports the `queryClient`; no feature public API.
8. Naming is inconsistent (`asyncHandler.ts` vs `error-handler.ts`, `modules/` instead of `features/`).

## 5. Technical debt

- No tests of any kind, no `test` script, no CI.
- No committed Drizzle migrations (`drizzle.config.ts` points to `src/db/migrations`, which does not exist).
- Dead code: `client/src/components/EmailCard.tsx` is never imported; `useEmail`, `useDeleteEmail`,
  `useDeleteAllEmails` are never used by any component; `react-router-dom` is installed but unused.
- `db/index.ts` uses `catch (err: any)`, non-null assertions, and an unreachable `DATABASE_URL` guard.
  `connectDB` runs `db.select()` with no table, which is not a meaningful connectivity check.
- `repository.getEmails` returns rows in unspecified order.
- `server.ts` prints a hard-coded SMTP port and has no graceful shutdown.
- Client `tsconfig.app.json` does not set `strict` explicitly.

## 6. Missing or incomplete functionality

These are described in the old README but **do not exist in the code**:

- **Attachments** – not parsed, stored, listed or downloadable. Attachments in a captured message are silently discarded.
- **Raw source and header inspection** – neither is stored or exposed by the API or UI.
- **In-memory store / `MAX_EMAILS` / `PORT`** – not real; storage is PostgreSQL and the variables are `API_PORT`, `API_HOST`, `SMTP_PORT`, `SMTP_HOST`, `DATABASE_URL`.
- **Dashboard served by the API on port 3000** – the API serves no static files; the client is a separate Vite app.
- **Docker, `npm test`, `.env.example` at repo root, MIT `LICENSE`** – none exist.
- Client has no UI for deleting emails even though hooks and API endpoints exist.
- Only the first `To` recipient is stored (`mailparser` can return several).

## 7. Documentation inaccuracies

- Root `README.md` describes an in-memory, Docker-capable, test-equipped product with features that are not implemented (see §6) and a placeholder clone URL. It is replaced entirely.
- `client/README.md` is the unmodified Vite template and says nothing about DevMail. It is removed in favour of the root docs.
- `client/.env.example` has `VITE_API_URL=` with no explanation. The client hard-codes `http://localhost:9000` in development, which does not match the server's default API port of 3000.

## 8. Security and reliability concerns

**Problems**

1. **Stored XSS in the dashboard.** `EmailDetails.tsx` renders untrusted email HTML via `<iframe srcDoc>` with no `sandbox` attribute, so scripts in a captured email run with the dashboard's origin.
2. **Wrong value stored for HTML body.** `mailparser` returns `html: false` for messages without HTML; the SMTP handler stores `parsed.html ?? ''`, which passes the boolean `false` into a text column.
3. **Error leakage.** The error handler returns `error.message` (including database errors) to clients even in production.
4. **Unvalidated input.** `POST /api/v1/emails` inserts the raw request body (mass assignment of any column); `:id` is not validated as a UUID, so a malformed id causes a database error and a 500.
5. **No SMTP size limit.** The SMTP server accepts messages of any size and buffers them in memory.
6. **Delete of a missing email returns 200** with a success message.
7. **No graceful shutdown** – SMTP connections and the DB pool are dropped on exit.

**Recommendations**

- CORS is fully open and the API has no authentication. This is acceptable for a local tool but should be documented (done in the README).
- List endpoint returns full bodies for every email; add pagination if inboxes grow large.

## 9. Recommended refactoring order

1. Documentation of the audit (this file).
2. Server: create `shared/` (config, database, errors, middleware); move the emails feature to `features/emails` with types, validation, typed errors and a public `index.ts`; fix items 3, 4, 6 above.
3. Server: split SMTP into `features/smtp` (server lifecycle + message parsing), depending on emails only through its public API; fix items 2, 5, 7.
4. Server tests (Node's built-in test runner; no new dependencies) and the initial Drizzle migration.
5. Client: move to `features/emails` + `shared/` + `app/`; remove dead code; sandbox the iframe; fix API base URL.
6. Repository standards: `.gitignore`, CI workflow, `typecheck`/`test` scripts, `.env.example` files.
7. Documentation rewrite (README, ARCHITECTURE, FEATURES, API, DEVELOPMENT, AGENTS).

## 10. Features that remain unchanged

- REST contract for existing endpoints: paths, success payload shape (`{ success, data }`), and email JSON fields.
  Deliberate deviations are listed in `docs/API.md` (404 on deleting a missing email, 400 for invalid input, newest-first ordering).
- Database table `emails` and its columns (no schema change).
- Technology choices: Express, Drizzle + Neon driver, `smtp-server`, `mailparser`, Zod, React, React Query, Tailwind.
- Visual design and behaviour of the dashboard.

Attachments, raw source and header inspection are **not** added by this refinement: they would require schema changes and new UI, which is outside the scope of an architecture refinement. They are documented as limitations.
