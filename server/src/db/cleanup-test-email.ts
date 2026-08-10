import { eq } from "drizzle-orm";

import { db } from "./index";
import { emails } from "./schema/emails";

async function main() {
  try {
    const deleted = await db
      .delete(emails);

    if (deleted.rowCount === 0) {
      console.log("⚠️ No email was found");
    } else {
      console.log(`✅ ${deleted.rowCount} email(s) deleted`);
    }
  } catch (error) {
    console.error("❌ Failed to delete test emails");
    console.error(error);
    process.exit(1);
  }
}

main();