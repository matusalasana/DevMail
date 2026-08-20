import { Router } from "express";

import {
  EmailController
} from "./email.controller.js";

const router = Router();


router.get("/", EmailController.getEmails);

router.post("/", EmailController.createEmail);

router.get("/:id", EmailController.getEmail);

router.delete("/:id", EmailController.deleteEmail);

router.delete("/", EmailController.deleteAllEmails);


export default router;