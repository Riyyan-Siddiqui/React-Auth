import { useEffect } from "react";
import { api } from "./axios";
import { useAuth } from "../context/authContext";

export const useAuthBootstrap = () => {
  const { setAccessToken } = useAuth();

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await api.post("/auth/refresh");
        setAccessToken(res.data.accessToken);
      } catch {
        setAccessToken(null);
      }
    };

    refresh();
  }, []);
};
