import { eq } from "drizzle-orm";

import { db } from "./index.ts";
import { emails } from "./schema/emails.js";

async function main() {

  try {
    const deleted = await db
      .delete(emails);

    if (deleted.length === 0) {
      console.log("⚠️ No email was found");
    } else {
      console.log("✅ Emails deleted");
    }
  } catch (error) {
    console.error("❌ Failed to delete test emails");
    console.error(error);
    process.exit(1);
  }
}

main();