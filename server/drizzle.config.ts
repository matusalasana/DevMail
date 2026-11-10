import { defineConfig } from "drizzle-kit";
import { env } from "./src/shared/config/env";

export default defineConfig({
  schema: "./src/features/*/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.databaseUrl,
  },
});