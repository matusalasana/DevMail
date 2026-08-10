import { Router } from "express";

import {
  deleteEmailController,
  getEmailController,
  getEmailsController,
  downloadAttachmentController
} from "./email.controller";

const router = Router();

router.get("/", getEmailsController);

router.get("/:id", getEmailController);

router.delete("/:id", deleteEmailController);

router.get(
  "/:id/attachments/:attachmentId",
  downloadAttachmentController,
);

export default router;