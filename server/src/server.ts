import "dotenv/config";

import { connectDB } from "./db";
import app from "./app";
import { startSmtpServer } from "./smtp/smtp.server.js";

const API_HOST = process.env.API_HOST ?? "0.0.0.0";
const API_PORT = Number(process.env.API_PORT ?? 3000);

app.listen(API_PORT, API_HOST, () => {
  console.log(`DevMail API running on http://localhost:${API_PORT}`);
});

startSmtpServer();
connectDB();