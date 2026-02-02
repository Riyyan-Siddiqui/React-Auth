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
  verificationToken?: string
}

interface OTPResponse {
  OTP?: string,
  verificationToken: string,
  accessToken?: string
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

// For verifying the OTP entered by the user
export async function verifyCode(OTP: string, verificationToken: string): Promise<OTPResponse> {
  const res = await api.post("/auth/verify-code", {
    otp: OTP,
    verificationToken, // pass the token returned from signup
  });
  return res.data;
}

// For resending a new OTP
export async function resendOTP(verificationToken: string): Promise<OTPResponse> {
  const res = await api.post("/auth/resend-otp", {
    verificationToken, // frontend sends the same token received after signup
  });
  return res.data;
}
