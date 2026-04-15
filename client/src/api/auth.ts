// src/api/auth.ts
import api from './axios';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthResponse {
  user: User;
  accessToken?: string; // ✅ Added accessToken
  message?: string;
  verificationToken?: string;
  code?: string,
  requiresVerification?: Boolean,
}

interface OTPResponse {
  OTP?: string;
  verificationToken?: string;
  accessToken?: string;
  user?: User; // ✅ Added user
}

export async function loginRequest(
  email: string, 
  password: string
): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", {
    email,
    password
  });
  return res.data; // Access Token + User
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
  return res.data; // Verification Token
}

// Logout - clears refresh token cookie
export async function logoutRequest(): Promise<{ message: string }> {
  const res = await api.post("/auth/logout");
  return res.data;
}

// Verify OTP - returns accessToken
export async function verifyCode(
  OTP: string, 
  verificationToken: string
): Promise<OTPResponse> {
  const res = await api.post<OTPResponse>("/auth/verify-code", {
    otp: OTP,
    verificationToken,
  });
  return res.data;
}

// Resend OTP - returns new verificationToken
export async function resendOTP(
  verificationToken: string
): Promise<OTPResponse> {
  const res = await api.post<OTPResponse>("/auth/resend-otp", {
    verificationToken,
  });
  return res.data;
}

// Refresh token - returns new accessToken
export async function refreshToken(): Promise<{ accessToken: string }> {
  const res = await api.post("/auth/refresh");
  return res.data;
}