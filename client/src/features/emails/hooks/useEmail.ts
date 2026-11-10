import { useQuery } from "@tanstack/react-query";
import { fetchEmail } from "../api";
import { emailKeys } from "./emailKeys";

export const useEmail = (emailId: string | null) =>
  useQuery({
    queryKey: emailKeys.detail(emailId ?? ""),
    queryFn: () => fetchEmail(emailId as string),
    enabled: emailId !== null,
  });
