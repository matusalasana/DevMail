import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

const deleteEmail = async (id: string) => {
  const res = await api.delete(`/emails/${id}`);

  return res.data;
};

export const useDeleteEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmail,

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