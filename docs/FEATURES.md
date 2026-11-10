# DevMail Features

Only features that exist in the code are listed. For missing functionality see [Limitations in the README](../README.md#limitations).

## Emails (server)

`server/src/features/emails/`

- **Purpose:** store, retrieve and delete captured emails; expose them over HTTP.
- **Responsibilities:** request validation, business rules (not-found handling), persistence through Drizzle, owning the `emails` table schema.
- **Files:** `routes.ts` → `controller.ts` → `service.ts` → `repository.ts` → `schema.ts`; `validation.ts`, `types.ts`.
- **Public API (`index.ts`):** `emailRoutes` (Express router), `emailService` (`listEmails`, `getEmail`, `createEmail`, `deleteEmail`, `deleteAllEmails`), types `Email`, `NewEmail`.
- **Endpoints:** `GET/POST/DELETE /api/v1/emails`, `GET/DELETE /api/v1/emails/:id` – see [API.md](API.md).
- **Depends on:** `shared/database`, `shared/errors`, `shared/middleware`.

## SMTP capture (server)

`server/src/features/smtp/`

- **Purpose:** receive email from applications under development and store it.
- **Responsibilities:** SMTP server lifecycle (start/stop), accepting messages without authentication, enforcing the 25 MB limit, parsing the raw message into `from`, `to`, `subject`, text and HTML bodies, and rejecting (not silently dropping) messages that cannot be stored.
- **Behaviour worth knowing:** missing sender/recipient/subject fall back to `Unknown` / `(No Subject)`; when there is no `To` header the SMTP envelope recipients are used; if the database write fails the client receives an SMTP error so it can retry.
- **Public API (`index.ts`):** `startSmtpServer`, `stopSmtpServer`.
- **Depends on:** the emails feature through its public API (`emailService.createEmail`, `NewEmail`), and `shared/config`.
- **Not captured:** attachments, raw source, headers.

## Emails (client)

`client/src/features/emails/`

- **Purpose:** the dashboard: inbox list and email detail view.
- **Responsibilities:** server-state via TanStack React Query (`useEmails` polls every 5 s), API calls (`api.ts`), presentation (`Inbox`, `EmailRow`, `EmailDetail`), loading / empty / error states, sandboxed HTML preview, tolerant rendering of emails with missing fields.
- **Public API (`index.ts`):** `Inbox`, hooks `useEmails`, `useEmail`, `useDeleteEmail`, `useDeleteAllEmails`, type `Email`. The delete hooks and `useEmail` are exported for use but are not yet wired into the UI.
- **Depends on:** `shared/api/httpClient` and the REST API above.

## Shared layer

- **Server `shared/`:** `config/env.ts` (Zod-validated environment), `database/client.ts` (Neon pool + Drizzle), `errors/app-error.ts` (`AppError`, `NotFoundError`), `middleware/` (`error-handler`, `validate`).
- **Client `shared/`:** `api/httpClient.ts` (Axios instance). `app/` holds the React Query provider and root component.
