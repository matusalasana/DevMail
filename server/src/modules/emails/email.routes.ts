import { Router } from "express";

import {
  deleteEmailController,
  getEmailsController,
} from "./email.controller";

const router = Router();

router.get("/", getEmailsController);

router.delete("/:id", deleteEmailController);

export default router;