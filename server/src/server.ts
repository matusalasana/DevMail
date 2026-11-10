import type { Server } from "node:http";
import app from "./app.js";
import { startSmtpServer, stopSmtpServer } from "./features/smtp/index.js";
import { env } from "./shared/config/env.js";
import {
  checkDatabaseConnection,
  closeDatabase,
} from "./shared/database/client.js";

function listen(): Promise<Server> {
  return new Promise((resolve, reject) => {
    const httpServer = app.listen(env.apiPort, env.apiHost, () =>
      resolve(httpServer),
    );
    httpServer.once("error", reject);
  });
}

async function main() {
  if (!(await checkDatabaseConnection())) {
    console.error("DevMail startup aborted: database unavailable");
    process.exit(1);
  }
  console.log("DevMail database connected");

  const httpServer = await listen();
  console.log(`DevMail API listening on http://${env.apiHost}:${env.apiPort}`);

  const smtp = await startSmtpServer();
  console.log(`DevMail SMTP listening on ${env.smtpHost}:${smtp.port}`);

  const shutdown = async () => {
    httpServer.close();
    await stopSmtpServer(smtp.server);
    await closeDatabase();
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

main().catch((error: unknown) => {
  console.error("DevMail startup failed:", error);
  process.exit(1);
});
