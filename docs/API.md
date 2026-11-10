# DevMail REST API

Base URL: `http://localhost:3000` (configurable with `API_HOST` / `API_PORT`). All endpoints return JSON. There is no authentication, and CORS allows any origin.

Verified against `server/src/features/emails/routes.ts` and covered by `server/src/features/emails/api.test.ts`.

## Email object

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string (UUID) | |
| `from` | string | Sender as written in the message, or `Unknown` |
| `to` | string | All recipients joined with `, `; falls back to SMTP envelope recipients, then `Unknown` |
| `subject` | string | `(No Subject)` when the message has none |
| `textBody` | string \| null | Plain-text part; empty string if none |
| `htmlBody` | string \| null | HTML part; empty string if none |
| `receivedAt` | string (ISO 8601) | When DevMail stored the message |
| `createdAt` | string (ISO 8601) | Row creation time |

## Endpoints

### `GET /health`
Liveness check. Returns `200 { "status": "ok", "service": "devmail-api" }`.

### `GET /api/v1/emails`
List all captured emails, newest first, with full bodies.

`200 { "success": true, "data": [Email, ...] }`

### `GET /api/v1/emails/:id`
Get one email.

- Path: `id` – UUID.
- `200 { "success": true, "data": Email }`
- `400` – `id` is not a UUID. `404` – no such email.

### `POST /api/v1/emails`
Store an email directly (SMTP capture is the normal path). `receivedAt` is set by the server.

Body (JSON):

| Field | Type | Required |
| --- | --- | --- |
| `from` | string (non-empty) | yes |
| `to` | string (non-empty) | yes |
| `subject` | string | yes |
| `textBody` | string \| null | no |
| `htmlBody` | string \| null | no |

Unknown fields are ignored.

- `201 { "success": true, "data": Email }`
- `400` – validation failed or the body is not valid JSON.

### `DELETE /api/v1/emails/:id`
Delete one email.

- `200 { "success": true, "message": "Email deleted successfully" }`
- `400` – invalid UUID. `404` – no such email.

### `DELETE /api/v1/emails`
Delete every email.

`200 { "success": true, "message": "All emails deleted successfully" }`

## Error responses

All errors share one shape:

```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "details": [{ "path": "from", "message": "Invalid input: expected string, received undefined" }]
}
```

- `details` is present only for validation errors (`400`).
- `stack` is included outside production for unexpected errors.
- Unexpected errors return `500`; in production the message is replaced by `Internal Server Error`.
- Unknown routes return `404 { "success": false, "message": "Route not found", ... }`.

## Changes from the pre-refactor API

Paths and success payloads are unchanged. Differences:

- `DELETE /api/v1/emails/:id` now returns `404` for a missing email (previously `200`).
- Invalid ids and invalid `POST` bodies return `400` (previously a `500` from the database, or unvalidated inserts).
- The list is ordered by `receivedAt` descending (previously unordered).
- Error bodies now always contain `success: false`.
- Emails captured over SMTP with several recipients store all of them in `to` (previously only the first), and messages without an HTML part store `""` instead of the boolean `false`.
