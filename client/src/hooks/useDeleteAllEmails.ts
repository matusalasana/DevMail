import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

const deleteAllEmails = async () => {
  const res = await api.delete(`/emails`);

  return res.data;
};

export const useDeleteAllEmails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllEmails,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["emails"],
      });
    },

    onError: (error) => {
      console.log(error)
    },
  });
};