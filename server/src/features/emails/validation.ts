import { z } from "zod";

export const emailIdParamsSchema = z.object({
  id: z.uuid("Email id must be a valid UUID"),
});

export const createEmailSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  subject: z.string(),
  textBody: z.string().nullish(),
  htmlBody: z.string().nullish(),
});

export type EmailIdParams = z.infer<typeof emailIdParamsSchema>;
export type CreateEmailInput = z.infer<typeof createEmailSchema>;
