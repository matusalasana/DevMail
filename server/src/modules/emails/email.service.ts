import { EmailRepository } from "./email.repository";


const getEmails = async () => {
  return await EmailRepository.getEmails();
};

const getEmail = async (id: string) => {
  return await EmailRepository.getEmail(id);
};

const createEmail = async (payload: any) => {
  return await EmailRepository.create(payload);
};

const deleteEmail = async (id: string) => {
  return await EmailRepository.deleteById(id);
};

const deleteAllEmails = async () => {
  return await EmailRepository.deleteAll();
};

export const EmailService = {
  getEmails,
  getEmail,
  createEmail,
  deleteEmail,
  deleteAllEmails,
};
