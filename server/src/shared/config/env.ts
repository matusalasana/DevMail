import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"])
    .default("development"),

  API_HOST: z.string().default("0.0.0.0"),
  API_PORT: z.coerce.number().int().positive().default(3000),

  SMTP_HOST: z.string().default("0.0.0.0"),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});


const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,

  apiHost: parsedEnv.data.API_HOST,
  apiPort: parsedEnv.data.API_PORT,

  smtpHost: parsedEnv.data.SMTP_HOST,
  smtpPort: parsedEnv.data.SMTP_PORT,

  databaseUrl: parsedEnv.data.DATABASE_URL,
};