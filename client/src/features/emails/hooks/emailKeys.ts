export const emailKeys = {
  all: ["emails"] as const,
  detail: (emailId: string) => ["emails", emailId] as const,
};
