import cors from "cors";
import express from "express";
import { emailRoutes } from "./features/emails/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./shared/middleware/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "devmail-api" });
});

app.use("/api/v1/emails", emailRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
