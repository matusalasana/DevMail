import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";
import { env } from "../config/env.js";

const pool = new Pool({ connectionString: env.databaseUrl });

export const db = drizzle(pool);

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch (error) {
    console.error("DevMail database connection failed:", error);
    return false;
  }
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
}
