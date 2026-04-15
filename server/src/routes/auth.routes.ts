import { Router } from "express";
import {
  logIn,
  signUp,
  refresh,
  getMe,
  logOut,
  forgetPassword,
  verifyCode,
  setPassword,
  resendOTP,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { isOwner } from "../middlewares/ownership.middleware.js";
import {
  authRateLimiter,
  signupRateLimiter,
  otpRateLimiter,
  refreshRateLimiter,
} from "../middlewares/rateLimiter.middleware.js";
import User from "../models/user.model.js";
import { hashToken } from "../utils/crypto.js";

const authRouter = Router();

// Public routes with rate limiting
authRouter.post("/login", authRateLimiter, logIn);
authRouter.post("/signup", signupRateLimiter, signUp);
authRouter.post("/refresh", refreshRateLimiter, refresh);

// OTP routes with strict rate limiting
authRouter.post("/verify-code", otpRateLimiter, verifyCode);
authRouter.post("/resend-otp", otpRateLimiter, resendOTP);

// Password reset routes
authRouter.post("/forget-password", authRateLimiter, forgetPassword);
authRouter.post("/reset-password", authRateLimiter, setPassword);

// Protected routes (require authentication)
authRouter.get("/me", authenticate, getMe);
authRouter.post("/logout", authenticate, logOut);

// Protected route with ownership check
authRouter.get(
  "/users/:id",
  authenticate,
  isOwner("id"), // check req.user.id === req.params.id OR role === admin
  async (req, res) => {
    const user = await User.findById(req.params.id).select(
      "-password -refreshTokens",
    );
    res.json({ user });
  },
);

authRouter.get("/session", authenticate, async (req, res) => {
  const user = await User.findById(req.user!.id);

  const sessions = user?.refreshTokens
    .filter((token: any) => token.expiresAt > new Date()) // only active sessions
    .map((token: any, index: number) => ({
      id: index,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      deviceInfo: token.deviceInfo,
      current: hashToken(req.cookies.refreshToken) === token.token,
    }));

  res.json({ sessions });
});

authRouter.delete("/sessions/:id", authenticate, async (req, res) => {
  const user = await User.findById(req.user!.id);
  const sessionIndex = parseInt(
    Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
  );

  if (user && sessionIndex >= 0 && sessionIndex < user.refreshTokens.length) {
    user.refreshTokens.splice(sessionIndex, 1);
    await user.save();
    res.json({ message: "Session revoked successfully"});
  } else {
    res.status(404).json({ message: "Session not found"});
  }
});

authRouter.post("/logout-all", authenticate, async (req, res) => {
    await User.updateOne(
        {_id: req.user!.id},
        { $set: {refreshTokens: []}}
    );

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out from all devices"});
})

export default authRouter;
