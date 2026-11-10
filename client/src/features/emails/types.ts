/** An email as returned by the DevMail API (dates are ISO strings). */
export type Email = {
  id: string;
  from: string;
  to: string;
  subject: string;
  textBody?: string | null;
  htmlBody?: string | null;
  receivedAt: string;
  createdAt?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};
