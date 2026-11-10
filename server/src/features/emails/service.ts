import { NotFoundError } from "../../shared/errors/app-error.js";
import { emailRepository } from "./repository.js";
import type { Email, NewEmail } from "./types.js";

const listEmails = (): Promise<Email[]> => emailRepository.findAll();

const getEmail = async (emailId: string): Promise<Email> => {
  const email = await emailRepository.findById(emailId);
  if (!email) throw new NotFoundError("Email not found");
  return email;
};

const createEmail = (newEmail: NewEmail): Promise<Email> =>
  emailRepository.create(newEmail);

const deleteEmail = async (emailId: string): Promise<void> => {
  const deletedEmail = await emailRepository.deleteById(emailId);
  if (!deletedEmail) throw new NotFoundError("Email not found");
};

const deleteAllEmails = (): Promise<void> => emailRepository.deleteAll();

export const emailService = {
  listEmails,
  getEmail,
  createEmail,
  deleteEmail,
  deleteAllEmails,
};
