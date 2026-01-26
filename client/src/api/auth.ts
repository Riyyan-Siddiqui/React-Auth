// src/api/auth.ts
import api from './axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  user: User;
  message?: string;
}

export async function loginRequest(
  email: string, 
  password: string
): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", {
    email,
    password
  });
  return res.data;
}

export async function signupRequest(
  name: string, 
  email: string, 
  password: string
): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/signup", {
    name,
    email,
    password
  });
  return res.data;
}

export async function logoutRequest(): Promise<AuthResponse> {
  const res = await api.post("/auth/logout");
  return res.data;
}