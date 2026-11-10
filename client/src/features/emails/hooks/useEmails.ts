import { useQuery } from "@tanstack/react-query";
import { fetchEmails } from "../api";
import { emailKeys } from "./emailKeys";

/** New emails arrive over SMTP at any time, so the inbox is polled. */
const INBOX_POLL_INTERVAL_MS = 5000;

export const useEmails = () =>
  useQuery({
    queryKey: emailKeys.all,
    queryFn: fetchEmails,
    refetchInterval: INBOX_POLL_INTERVAL_MS,
  });
