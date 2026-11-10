import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAllEmails } from "../api";
import { emailKeys } from "./emailKeys";

export const useDeleteAllEmails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllEmails,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: emailKeys.all }),
  });
};
