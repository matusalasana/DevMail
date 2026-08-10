import { deleteEmailById } from "./email.service";

async function main() {
  const emailId = "348b2f65-1e06-4955-8ff4-7d760c4a3bdd";

  try {
    const deleted = await deleteEmailById(emailId);

    if (!deleted) {
      console.log("⚠️ Email was not found");
      return;
    }

    console.log("✅ Email deleted successfully");
  } catch (error) {
    console.error("❌ Email deletion failed");
    console.error(error);

    process.exit(1);
  }
}

main();