import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler.js";
import emailRoutes from "./modules/emails/email.routes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/emails", emailRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "devmail-api",
  });
});

app.use(errorHandler)

export default app;