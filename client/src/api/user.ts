// src/api/user.ts
import api from "./axios";

interface User {
  id: string;
  email: string;
  name: string;
}

export async function getMe(): Promise<User> {
  const res = await api.get<{ user: User }>("/auth/me");
  return res.data.user;
}