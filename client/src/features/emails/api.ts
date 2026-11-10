import { httpClient } from "../../shared/api/httpClient";
import type { ApiResponse, Email } from "./types";

export const fetchEmails = async (): Promise<Email[]> => {
  const response = await httpClient.get<ApiResponse<Email[]>>("/emails");
  return response.data.data;
};

export const fetchEmail = async (emailId: string): Promise<Email> => {
  const response = await httpClient.get<ApiResponse<Email>>(`/emails/${emailId}`);
  return response.data.data;
};

export const deleteEmail = async (emailId: string): Promise<void> => {
  await httpClient.delete(`/emails/${emailId}`);
};

export const deleteAllEmails = async (): Promise<void> => {
  await httpClient.delete("/emails");
};
