# DevMail 📧

DevMail is a lightweight, developer-focused email testing and routing service for capturing, inspecting, and debugging transactional emails in local and staging environments—without accidentally sending emails to real users.

It provides a local SMTP server, web-based inbox, email inspection tools, and a REST API for automated testing.

---

## ✨ Features

- 📥 Catch-all SMTP server — Capture outgoing emails regardless of the recipient address.
- 🔍 Email inspection — Inspect headers, raw source, HTML, and plain-text content.
- 🖥️ Web dashboard — Browse and inspect captured emails from a local inbox.
- 🧪 Testing-friendly REST API — Query and manage captured emails from Jest, Playwright, Cypress, or other test suites.
- 📎 Attachment support — Inspect and download email attachments.
- ⚡ Instant capture — Emails are available for inspection as soon as they are received.
- 🔒 Safe local development — Keep test emails away from real users and external email providers.
- 🌐 Offline-friendly — Run DevMail locally without relying on a third-party email delivery service.
- 🪶 Lightweight — Designed to be simple to install, configure, and run.

---

## ⚡ Quick Start

Prerequisites

Choose either a local Node.js installation or Docker.

Local development:

- "Node.js" (https://nodejs.org/) ">= 18"
- npm, pnpm, or yarn

Docker:

- Docker ">= 20"

### Installation

Clone the repository and install the dependencies:
```
git clone https://github.com/your-username/devmail.git
cd devmail
```
npm install

Environment Configuration

Copy the example environment file:

cp .env.example .env

Update ".env" if you need to customize the default configuration.

Start DevMail

Start the development server:

npm run dev

Once the server is running, open the dashboard:

http://localhost:3000

---

## 🚀 Usage

Configure Your Application

Point your application's SMTP configuration to the DevMail SMTP server.

Setting| Value
SMTP Host| "localhost" or "127.0.0.1"
SMTP Port| "1025"
Username| Optional / Any
Password| Optional / Any
TLS| Disabled for local development

For example:

SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=

«Tip: Configure DevMail only in your development, testing, or staging environment. Avoid pointing production applications at a local test SMTP server.»

Send a Test Email

Once your application is configured, send an email normally.

For example, using Nodemailer:

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
});

await transporter.sendMail({
  from: "no-reply@example.test",
  to: "developer@example.test",
  subject: "DevMail test",
  text: "This email was captured by DevMail.",
  html: "<h1>Hello from DevMail!</h1>",
});

The email should appear immediately in the DevMail dashboard.

---

## 🖥️ Web Dashboard

Open:

http://localhost:3000

The dashboard provides a local inbox where you can browse captured emails and inspect their contents.

Depending on the email, you can inspect:

- Sender and recipient information
- Subject
- Email headers
- Plain-text content
- Rendered HTML
- Raw email source
- Attachments

---

## 🧪 Automated Testing

DevMail is designed to work well with automated end-to-end and integration tests.

You can use the REST API to:

1. Clear the test inbox.
2. Trigger an email from your application.
3. Query captured emails.
4. Assert the recipient, subject, body, headers, or attachments.
5. Clean up after the test.

This makes DevMail suitable for tools such as:

- Jest
- Vitest
- Playwright
- Cypress
- Supertest
- Postman
- Custom test runners

Example

# Clear the inbox
curl -X DELETE http://localhost:3000/api/v1/emails

# Retrieve captured emails
curl http://localhost:3000/api/v1/emails

---

## 🔌 REST API

The API is available under:

/api/v1

Get Captured Emails

GET /api/v1/emails

Returns the emails currently stored by DevMail.

Example:

curl http://localhost:3000/api/v1/emails

Get a Specific Email

GET /api/v1/emails/:id

Returns the complete payload for a specific captured email.

Example:

curl http://localhost:3000/api/v1/emails/123

Clear the Inbox

DELETE /api/v1/emails

Deletes all currently captured emails.

Example:

curl -X DELETE http://localhost:3000/api/v1/emails

---

## ⚙️ Configuration

DevMail can be configured through environment variables in ".env".

Environment Variables

Variable| Default| Description
"PORT"| "3000"| Port used by the web dashboard and REST API
"SMTP_PORT"| "1025"| Port used by the local SMTP server
"MAX_EMAILS"| "100"| Maximum number of emails retained in memory

Example ".env":

PORT=3000
SMTP_PORT=1025
MAX_EMAILS=100

«Note: Captured emails are stored in memory. Restarting DevMail clears the current inbox unless persistent storage is implemented.»

---

## 🐳 Docker

DevMail can also be run with Docker if a Docker configuration is provided by the project.

Build the image:

docker build -t devmail .

Run DevMail:

docker run --rm \
  -p 3000:3000 \
  -p 1025:1025 \
  devmail

The dashboard will then be available at:

http://localhost:3000

Your application can connect to the SMTP server on:

localhost:1025

---

## 🏗️ Architecture

At a high level, DevMail consists of three components:
```
┌─────────────────────┐
│   Your Application  │
└──────────┬──────────┘
           │ SMTP
           ▼
┌─────────────────────┐
│   DevMail SMTP      │
│      Server         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  In-Memory Inbox    │
└──────────┬──────────┘
           │
      ┌────┴─────┐
      ▼          ▼
┌──────────┐ ┌──────────┐
│   Web UI │ │ REST API │
└──────────┘ └──────────┘
```
This architecture keeps email delivery inside your development environment and makes captured messages accessible through both the browser and API.

---

## 🔐 Security Considerations

DevMail is intended primarily for local development and controlled staging environments.

By default, the SMTP server and web interface may not provide authentication or encryption suitable for production use.

When running DevMail in a shared or remote environment:

- Do not expose the SMTP server publicly without appropriate protection.
- Do not expose captured emails to untrusted users.
- Avoid placing sensitive production email data into DevMail.
- Use network controls or authentication if the service is accessible outside your local machine.
- Keep DevMail disabled or isolated from production email infrastructure.

---

## 🛠️ Development

Install dependencies:

npm install

Start the development server:

npm run dev

Run tests:

npm test

Build the application:

npm run build

«The exact commands may vary depending on the project's configured scripts in "package.json".»

---

## 🗺️ Roadmap

Potential future improvements include:

- [ ] Persistent email storage
- [ ] Email search and filtering
- [ ] Inbox pagination
- [ ] Email export
- [ ] Improved attachment inspection
- [ ] SMTP authentication
- [ ] WebSocket-based live inbox updates
- [ ] Docker Compose support
- [ ] Email preview on mobile devices
- [ ] Configurable retention policies
- [ ] Test-specific inboxes
- [ ] Webhook support
- [ ] Advanced email assertions for automated tests

---

## 🤝 Contributing

Contributions, bug reports, feature requests, and improvements are welcome.

A typical contribution workflow:

git checkout -b feature/my-feature

# Make your changes

npm test

git add .
git commit -m "feat: add my feature"

git push origin feature/my-feature

Then open a pull request with a clear description of your changes.

---

## 📄 License

DevMail is licensed under the MIT License.

See the "LICENSE" file for the complete license text.

---

## ❤️ Why DevMail?

Testing email shouldn't require sending emails to real inboxes.

DevMail gives developers a fast, local, and predictable way to capture emails, inspect exactly what their application generated, and verify email workflows automatically—without relying on external email providers.