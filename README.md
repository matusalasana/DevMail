# DevMail

DevMail is a developer-focused email testing tool. It runs a local SMTP server that captures outgoing email, stores it in PostgreSQL, and shows it in a web dashboard and a REST API, so you can inspect what your application sends without delivering anything to real recipients.

## The problem

Applications send email during development (sign-up confirmations, password resets, receipts). Sending those through a real provider risks mailing real people and makes the output hard to inspect. DevMail accepts any message on a local SMTP port, keeps it, and lets you read it.

## Features

- **SMTP capture** – accepts mail for any recipient, without authentication, on a configurable port (default `1025`).
- **Parsing** – extracts sender, recipients, subject, plain-text body and HTML body with `mailparser`. Incomplete messages are still captured with placeholders.
- **Persistence** – captured emails are stored in PostgreSQL through Drizzle ORM and survive restarts.
- **Dashboard** – React inbox listing emails (newest first, refreshed every 5 s) and a detail view with a sandboxed HTML preview and a plain-text view.
- **REST API** – list, read, create, delete one and delete all emails under `/api/v1/emails`. See [docs/API.md](docs/API.md).

Not implemented (yet): attachments, raw message source, header inspection, authentication, pagination, search. See [Limitations](#limitations).

## Technology stack

| Area | Technology |
| --- | --- |
| Server | Node.js, TypeScript (strict), Express 5, `smtp-server`, `mailparser`, Zod |
| Database | PostgreSQL via Drizzle ORM and the Neon serverless driver |
| Client | React 19, TypeScript, Vite, TanStack React Query, Axios, Tailwind CSS 4 |
| Tests | Node.js built-in test runner (run through `tsx`) |

## Architecture

DevMail uses a feature-based (vertical slice) architecture. Each feature owns its routes, services, persistence and UI, and exposes a public `index.ts`; shared code is limited to cross-cutting infrastructure.

```
server/src/
  features/
    emails/    REST API, validation, service, repository, schema
    smtp/      SMTP server lifecycle and message parsing (uses emails' public API)
  shared/      config, database client, errors, middleware
client/src/
  features/
    emails/    inbox UI, hooks, API calls
  shared/      HTTP client
  app/         providers and root component
docs/          architecture, features, API, development guides
```

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/FEATURES.md](docs/FEATURES.md), [docs/ARCHITECTURE_AUDIT.md](docs/ARCHITECTURE_AUDIT.md).

## Getting started

### Prerequisites

- Node.js 22 and npm (the version used in development and CI; older versions are untested)
- A PostgreSQL database reachable through the Neon serverless driver (a free Neon project works). Other PostgreSQL setups have not been tested.

### Install

```bash
git clone https://github.com/matusalasana/DevMail.git
cd DevMail
(cd server && npm install)
(cd client && npm install)
```

### Configure

```bash
cp server/.env.example server/.env   # set DATABASE_URL
cp client/.env.example client/.env   # optional; defaults to http://localhost:3000/api/v1
```

| Variable | Package | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | server | none (required) | PostgreSQL connection string |
| `NODE_ENV` | server | `development` | `development`, `test` or `production` |
| `API_HOST` / `API_PORT` | server | `0.0.0.0` / `3000` | REST API bind address |
| `SMTP_HOST` / `SMTP_PORT` | server | `0.0.0.0` / `1025` | SMTP bind address |
| `VITE_API_URL` | client | `http://localhost:3000/api/v1` | API base URL, including `/api/v1` |

### Database

```bash
cd server
npm run migrate   # apply drizzle/0000_init.sql
```

If your database was created earlier with `npm run push`, the `emails` table already exists and the initial migration will fail; keep using `npm run push` for that database.

### Run

```bash
# terminal 1: API (3000) + SMTP (1025)
cd server && npm run dev

# terminal 2: dashboard (http://localhost:5173)
cd client && npm run dev
```

### Point your application at DevMail

| Setting | Value |
| --- | --- |
| SMTP host | `localhost` |
| SMTP port | `1025` |
| Username / password | none |
| Secure (implicit TLS) | `false` |

Example with Nodemailer (not a dependency of this project):

```js
const transporter = nodemailer.createTransport({ host: "localhost", port: 1025, secure: false });
await transporter.sendMail({ from: "no-reply@example.test", to: "dev@example.test", subject: "Hello", text: "Captured by DevMail" });
```

The email appears in the dashboard within a few seconds, or immediately in `GET /api/v1/emails`.

## Development commands

| Where | Command | Purpose |
| --- | --- | --- |
| `server/` | `npm run dev` | Start API and SMTP with reload |
| `server/` | `npm run typecheck` | Type-check including tests |
| `server/` | `npm test` | Run server tests (no database needed) |
| `server/` | `npm run build` / `npm start` | Compile to `dist/` and run it |
| `server/` | `npm run generate` / `migrate` / `push` | Drizzle migrations |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run lint` / `typecheck` / `build` | Quality checks and production build |

More in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Testing

`cd server && npm test` runs the server tests, which cover the REST API (over real HTTP with the repository mocked), request validation, message parsing and an SMTP end-to-end capture including concurrent connections and persistence failure. They do not need a database. There are currently no client tests and no tests that run against a real PostgreSQL instance.

## Deployment

The server builds with `npm run build` and starts with `npm start`; the client builds to static files with `npm run build` (set `VITE_API_URL` at build time). No Dockerfile or hosting configuration is included, and no public demo is provided.

## Limitations

- Attachments are **not** stored or shown; they are discarded when a message is captured.
- Raw source and headers are not stored or shown.
- Messages larger than 25 MB are rejected (SMTP 552).
- The list endpoint returns every email with full bodies; there is no pagination or search.
- The dashboard has no delete controls yet (the API and client hooks exist).
- The SMTP server does not require authentication.

## Security considerations

DevMail is meant for local development and trusted networks. The API has no authentication and allows any CORS origin, and the SMTP server accepts any sender. Do not expose either port to the internet, and do not route production email through it. Captured HTML is rendered in a sandboxed iframe (scripts disabled). Keep `server/.env` out of version control.

## Future improvements

Attachment capture, raw source and header views, delete controls in the dashboard, pagination and search, API authentication.
