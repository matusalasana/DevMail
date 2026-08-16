import { useQuery } from "@tanstack/react-query";
import api from "../api";

const getEmails = async () => {
  const res = await api.get("/emails");
  return res.data.data;
};

export const useEmails = () => {
  return useQuery({
    queryKey: ["emails"],
    queryFn: getEmails,
    staleTime: 1000 * 60 * 30,
  });
};