import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "../config/env.js";

if (!env.databaseUrl) {
throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
connectionString: env.databaseUrl!,
});

export const db = drizzle(pool);

export const connectDB = async () => {
try {
await db.select();
console.log("✅ DevMail Database Connected!");
return true;
} catch (err: any) {
console.log('❌ DevMail Database connection failed:', err);
return false;
}
};