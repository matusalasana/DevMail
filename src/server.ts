import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const API_HOST = process.env.API_HOST ?? "0.0.0.0";
const API_PORT = Number(process.env.API_PORT ?? 3000);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "devmail-api",
  });
});

app.listen(API_PORT, API_HOST, () => {
  console.log(`DevMail API running on http://localhost:${API_PORT}`);
});