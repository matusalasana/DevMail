import { useQuery } from "@tanstack/react-query";
import api from "../api";

const getEmail = async (id: string) => {
  const res = await api.get(`/emails/${id}`);
  return res.data.data;
};

export const useEmail = (id: string | null) => {
  return useQuery({
    queryKey: ["emails", id],
    queryFn: () => getEmail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
};