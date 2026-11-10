# AGENTS.md – DevMail engineering rules

## Purpose
DevMail captures outgoing development email over SMTP, stores it in PostgreSQL and exposes it through a REST API and a React dashboard. Reliability of capture, parsing and persistence matters more than extra features. Do not claim or document functionality that is not in the code (attachments, raw source and headers are **not** implemented).

## Stack (verified)
- `server/`: Node 22, TypeScript strict, Express 5, `smtp-server`, `mailparser`, Zod 4, Drizzle ORM + `@neondatabase/serverless`, `tsx`, Node test runner.
- `client/`: React 19, TypeScript, Vite, TanStack React Query, Axios, Tailwind CSS 4, ESLint.
- Do not swap frameworks, the ORM or the database. Avoid new dependencies.

## Architecture: feature-based / vertical slices
- `server/src/features/<feature>/` and `client/src/features/<feature>/`; shared infrastructure in `shared/`; `app/` on the client.
- Every feature has a top-level `index.ts` that is its only public API. Other features import from it, never from internal files. Export only what is needed.
- Dependencies point `features → shared`, never the reverse. No circular imports. Only create files that are needed; no empty folders.
- Full rules and the "add a feature" checklist: `docs/ARCHITECTURE.md`.

### Server boundaries
- `routes.ts`: endpoints + middleware only. `controller.ts`: HTTP in/out, no business logic, no DB, no `try/catch` (Express 5 forwards rejections). `service.ts`: business rules, no `req`/`res`, throws `AppError`. `repository.ts`: Drizzle only. `validation.ts`: Zod. Schema lives in the owning feature's `schema.ts`.
- Read configuration only through `shared/config/env.ts`.

### Client boundaries
- Per feature: `api.ts`, `hooks/`, `components/`, `utils/`, `types.ts`, `index.ts`. Server state belongs to React Query; do not copy it into other stores. Add a `store/` only for genuine client-only state.
- Email HTML is untrusted: keep it in the sandboxed iframe.

## Conventions
- Domain names (`email`, `emailId`, `emailService`, `emailRepository`); avoid `data`, `helper`, `manager`, `handler` unless truly apt.
- No `any`, no needless type assertions, never weaken `tsconfig`. Prefer inference; annotate boundaries.
- Preserve API contracts; if one must change, document it in `docs/API.md`.

## Testing and verification
Before finishing a change run, and report only what actually ran:
- `cd server && npm run typecheck && npm test && npm run build`
- `cd client && npm run lint && npm run build`
Add real behavior tests (capture, parsing, persistence, validation, errors) beside the code (`*.test.ts`); never weaken tests to pass. Tests must not need a real database (see `docs/DEVELOPMENT.md`).

## Documentation
Keep `README.md`, `docs/ARCHITECTURE.md`, `docs/FEATURES.md`, `docs/API.md`, `docs/DEVELOPMENT.md` and the two `.env.example` files in sync with the code. No invented badges, screenshots, demos or metrics.

## Git
- Conventional Commits; small, logical commits; stage specific files, never secrets or `.env` files.
- No `Co-authored-by` or AI attribution trailers.
- Do not amend, force-push or rewrite history. Push only when asked.
- Commands: `server`: `npm run dev|typecheck|test|build|generate|migrate`; `client`: `npm run dev|lint|typecheck|build`.
