export type Email = {
  id: string;
  from: string;
  to: string;
  subject: string;
  textBody?: string | null;
  htmlBody?: string | null;
  receivedAt: string | Date;
  createdAt?: string | Date;
}