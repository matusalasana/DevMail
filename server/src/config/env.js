"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
var zod_1 = require("zod");
var envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"])
        .default("development"),
    API_HOST: zod_1.z.string().default("0.0.0.0"),
    API_PORT: zod_1.z.coerce.number().int().positive().default(3000),
    SMTP_HOST: zod_1.z.string().default("0.0.0.0"),
    SMTP_PORT: zod_1.z.coerce.number().int().positive().default(1025),
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
});
var parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsedEnv.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = {
    nodeEnv: parsedEnv.data.NODE_ENV,
    apiHost: parsedEnv.data.API_HOST,
    apiPort: parsedEnv.data.API_PORT,
    smtpHost: parsedEnv.data.SMTP_HOST,
    smtpPort: parsedEnv.data.SMTP_PORT,
    databaseUrl: parsedEnv.data.DATABASE_URL,
};
