import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEmail } from "../api";
import { emailKeys } from "./emailKeys";

export const useDeleteEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: emailKeys.all }),
  });
};
