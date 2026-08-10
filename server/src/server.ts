import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./db/index.js";
import { startSmtpServer } from "./smtp/smtp.server.js";

const API_HOST = process.env.API_HOST ?? "0.0.0.0";
const API_PORT = Number(process.env.API_PORT ?? 3000);

async function startServer() {
  const databaseConnected = await connectDB();

  if (!databaseConnected) {
    console.error("❌ DevMail startup aborted: database unavailable");
    process.exit(1);
  }

  app.listen(API_PORT, API_HOST, () => {
    console.log(
      `🚀 DevMail API running on http://localhost:${API_PORT}`,
    );
  });

  startSmtpServer();

  console.log("📨 DevMail SMTP server started on port 1025");
}

startServer().catch((error) => {
  console.error("❌ DevMail startup failed:", error);
  process.exit(1);
});