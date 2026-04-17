import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreshToken,
} from "../utils/jwt.js";
import {
  generateOTP,
  generateResetToken,
  hashOTP,
  hashResetToken,
  hashToken,
} from "../utils/crypto.js";
import { sendOTPEmail, sendPasswordResetEmail } from "../utils/send-email.js";
import { EMAIL_VERIFY_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import { validatePassword } from "../utils/passwordValidator.js";
export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { isValid, errors, strength } = validatePassword(password);
    if (!isValid) {
      return res.status(400).json({
        message: `Password does not meet security requirements \n${errors}`,
        code: "WEAK_PASSWORD",
        requirements: errors,
        strength,
      });
    }
    //1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        code: "MISSING_FIELDS",
        fields: {
          name: !name,
          email: !email,
          password: !password,
        },
      });
    }
    // 2. Valide email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        code: "INVALID_EMAIL",
      });
    }
    // 4. Explict Check: Does user already exist?
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (!existingUser.emailVerified) {
        await User.deleteOne({ _id: existingUser._id });
      } else {
        return res.status(409).json({
          message: "User with this email already exists",
          code: "EMAIL_EXISTS",
        });
      }
    }
    // 5. Hash Passwrod
    const hashedPassword = await bcrypt.hash(password, 10);
    //6. Genarate Email OTP
    const otp = generateOTP();
    // 7. Create User (not verified yet)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      emailVerified: false,
      emailOTP: {
        code: hashOTP(otp),
        expiresAt: new Date(Date.now() + 1 * 60 * 1000), //1 min
        resendCount: 0,
        attempts: 0,
      },
    });
    const verificationToken = generateEmailVerificationToken(
      user._id.toString(),
    );
    // 8. Send OTP email
    await sendOTPEmail(user.email, user.name, otp);
    res.status(201).json({
      message: "Signup successful. Please verify email using OTP",
      verificationToken, // Frontend stores temporary in memory not in local storage.
    });
  } catch (error) {
    res.status(500).json({ message: "Signup Failed" });
  }
};
export const resendOTP = async (req, res) => {
  const { verificationToken } = req.body;
  // Validate
  if (!verificationToken) {
    return res.status(400).json({
      message: "Verification token requried",
      code: "MISSING_TOKEN",
    });
  }
  //verify and decode the verification token
  let payload;
  try {
    payload = jwt.verify(verificationToken, EMAIL_VERIFY_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired verification token",
      code: "INVALID_TOKEN",
    });
  }
  // Check token type
  if (payload.type !== "email_verification") {
    return res.status(403).json({
      message: "Invalid token scope",
      code: "INVALID_SCOPE",
    });
  }
  // Get user from token payload
  const user = await User.findById(payload.sub);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      code: "USER_NOT_FOUND",
    });
  }
  // Check if already verified
  if (user.emailVerified) {
    return res.status(400).json({
      message: "Email already verified",
      code: "ALREADY_VERIFIED",
    });
  }
  const otpData = user.emailOTP;
  // Check if locked
  if (otpData.lockedUntil && otpData.lockedUntil > new Date()) {
    const remainingTime = Math.ceil(
      (otpData.lockedUntil.getTime() - Date.now()) / 1000 / 60,
    );
    return res.status(429).json({
      message: `Too many attempts. Try again in ${remainingTime} minutes.`,
      code: "LOCKED",
      retryAfter: remainingTime,
    });
  }
  // Check resend count
  if (otpData.resendCount >= 3) {
    otpData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15min lock
    await user.save();
    return res.status(429).json({
      message: "Too many OTP requests. Account locked for 15 minutes.",
      cod: "MAX_RESENDS_REACHED",
    });
  }
  // Generate new OTP
  const otp = generateOTP();
  otpData.code = hashOTP(otp);
  otpData.expiresAt = new Date(Date.now() + 60 * 1000); // 1min
  otpData.resendCount += 1;
  otpData.attempts = 0; // Reset attempts on new OTP
  // Generate new verification token
  const newVerificationToken = generateEmailVerificationToken(
    user._id.toString(),
  );
  await user.save();
  // send email with correct parameter order
  await sendOTPEmail(user.email, user.name, otp);
  res.json({
    message: "OTP resent successfully",
    verificationToken: newVerificationToken, // return new token
    resendCount: otpData.resendCount,
    remainingResends: 3 - otpData.resendCount,
  });
};
export const logIn = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "Invalid Credentials" });
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid Credentials" });
  // Check email verification
  if (!user.emailVerified) {
    // Generate new OTP
    const otp = generateOTP();
    user.emailOTP = {
      code: hashOTP(otp),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      resendCount: 0,
      attempts: 0,
    };
    await user.save();
    // Generate verification token
    const verificationToken = generateEmailVerificationToken(
      user._id.toString(),
    );
    // send otp email
    await sendOTPEmail(user.email, user.name, otp);
    // Return special reponse
    return res.status(403).json({
      message: "Email not verified. We've sent you a new verification code.",
      code: "EMAIL_NOT_VERIFIED",
      verificationToken, // Frontend will use this
      requiresVerification: true,
    });
  }
  // Email is verified
  user.refreshTokens.splice(0);
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  // user.refreshToken = refreshToken;
  user.refreshTokens.push({
    token: hashToken(refreshToken),
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deviceInfo: {
      ip: req.ip, // ✅ Automatic
      userAgent: req.headers["user-agent"],
      lastUsed: new Date(),
    },
  });
  await user.save();
  await sendOTPEmail(
    user.email,
    "New Login Detected",
    `
      We detected a new login to your account.
      Location: ${req.ip},
      Device: ${req.headers["user-agent"]}
      Time: ${new Date()}

      If this wasn't you, reset your password immediately.
    `,
  );
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      accessToken,
      message: "Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }
  const hashedToken = hashToken(refreshToken);
  const user = await User.findOne({
    "refreshTokens.token": hashedToken,
  });
  if (!user) {
    // ✅ Changed from 403 to 401, removed user.updateMany
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
  // Remove old token
  user.refreshTokens = user.refreshTokens.filter(
    (t) => t.token !== hashedToken,
  );
  // Generate new token
  const newRefreshToken = generateRefreshToken(user);
  const newHashedToken = hashToken(newRefreshToken);
  user.refreshTokens.push({
    token: newHashedToken,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deviceInfo: {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      lastUsed: new Date(),
    },
  });
  await user.save();
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    accessToken: generateAccessToken(user),
  });
};
export const logOut = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await User.updateOne(
      { "refreshTokens.token": hashToken(refreshToken) },
      { $pull: { refreshTokens: { token: hashToken(refreshToken) } } },
    );
  }
  res.clearCookie("refreshToken", {
    path: "/",
  });
  res.json({
    message: "Logged Out Successfully",
    code: "LOGOUT_SUCCESS",
  });
};
export const getMe = async (req, res) => {
  try {
    // req.user is set by authenticate middleware
    const user = await User.findById(req.user.id).select(
      "-password -refreshTokens",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const verifyCode = async (req, res, next) => {
  const { otp, verificationToken } = req.body;
  if (!otp || !verificationToken)
    return res.status(400).json({ message: "OTP and token required." });
  let payload;
  try {
    payload = jwt.verify(verificationToken, EMAIL_VERIFY_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  if (payload.type !== "email_verification")
    return res.json(403).json({ message: "Invalid token scope" });
  const user = await User.findById(payload.sub);
  if (!user) return res.status(404);
  if (user.emailVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }
  const emailOTP = user.emailOTP;
  if (!emailOTP) {
    return res.status(400).json({
      message: "OTP not found",
    });
  }
  // lock check
  if (emailOTP.lockedUntil && emailOTP.lockedUntil.getTime() > Date.now()) {
    return res.status(429).json({
      message: "Too many attempts. Please try again later.",
    });
  }
  // Expiry Check
  if (emailOTP.expiresAt.getTime() < Date.now()) {
    return res.status(400).json({
      message: "OTP expired",
    });
  }
  // OTP mismatch
  if (emailOTP.code !== hashOTP(otp)) {
    emailOTP.attempts += 1;
    if (emailOTP.attempts >= 3) {
      emailOTP.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      emailOTP.attempts = 0;
    }
    await user.save();
    return res.status(400).json({
      message: "Invlaid OTP",
    });
  }
  // Success Verify Email
  user.emailVerified = true;
  user.emailOTP = undefined;
  // Issue tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshTokens.push({
    token: hashToken(refreshToken),
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deviceInfo: {
      ip: req.ip, // ✅ Automatic
      userAgent: req.headers["user-agent"],
      lastUsed: new Date(),
    },
  });
  await user.save();
  // set refresh cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    accessToken,
    message: "Email verified successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        code: "MISSING_EMAIL",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        code: "INVALID_EMAIL",
      });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    // ✅ SECURITY: Always return success (don't reveal if email exists)
    // This prevents attackers from discovering valid emails
    if (!user) {
      console.log(
        `⚠️ Password reset requested for non-existent email: ${email}`,
      );
      return res.status(200).json({
        message:
          "If an account exists with this email, you will receive a password reset link.",
        code: "RESET_EMAIL_SENT",
      });
    }
    if (
      user.passwordReset?.lockedUntil &&
      user.passwordReset.lockedUntil > new Date()
    ) {
      const remainingTime = Math.ceil(
        (user.passwordReset.lockedUntil.getTime() - Date.now()) / 1000 / 60,
      );
      return res.status(429).json({
        message: `Too many password reset attempts. Try again in ${remainingTime} minutes.`,
        code: "RESET_LOCKED",
        retryAfter: remainingTime,
      });
    }
    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);
    user.passwordReset = {
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1hr
      attempts: 0,
      lockedUntil: undefined,
    };
    await user.save();
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Clean up the reset token if email fails
      user.passwordReset = undefined;
      await user.save();
      return res.status(500).json({
        message: "Failed to send password reset email. Please try again.",
        code: "EMAIL_SEND_FAILED",
      });
    }
    console.log(
      `✅ Password reset requested for ${user.email} from IP: ${req.ip}`,
    );
    res.status(200).json({
      message:
        "If an account exists with this email, you will receive a password reset link.",
      code: "RESET_EMAIL_SENT",
    });
  } catch (error) {
    console.error("Forget password error:", error);
    res.status(500).json({
      message: "Failed to process password reset request",
      code: "SERVER_ERROR",
    });
  }
};
export const setPassword = async (req, res, next) => {
  try {
    const { token, confirmPassword, newPassword } = req.body;
    if (!token || !confirmPassword || !newPassword) {
      return res.status(400).json({
        message: "Reset token, confirm password and new password are required",
        code: "MISSING_FIELDS",
      });
    }
    const isSame = confirmPassword === newPassword;
    if (!isSame) {
      return res.status(400).json({
        message: "new password and confirm password not same.",
      });
    }
    const { isValid, errors, strength } = validatePassword(newPassword);
    if (!isValid) {
      return res.status(400).json({
        message: "Password does not meet security requirements",
        code: "WEAK_PASSWORD",
        requirements: errors,
        strength,
      });
    }
    const hashedToken = hashResetToken(token);
    const user = await User.findOne({
      "passwordReset.token": hashedToken,
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired password reset token",
        code: "INVALID_TOKEN",
      });
    }
    if (
      user.passwordReset?.lockedUntil &&
      user.passwordReset.lockedUntil > new Date()
    ) {
      const remainingTime = Math.ceil(
        (user.passwordReset.lockedUntil.getTime() - Date.now()) / 1000 / 60,
      );
      return res.status(429).json({
        message: `Too many failed attempts. Try again in ${remainingTime} minutes.`,
        code: "RESET_LOCKED",
        retryAfter: remainingTime,
      });
    }
    // 6. Check if token expired
    if (
      !user.passwordReset?.expiresAt ||
      user.passwordReset.expiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "Password reset token has expired. Please request a new one.",
        code: "TOKEN_EXPIRED",
      });
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from your current password",
        code: "PASSWORD_SAME_AS_OLD",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    // Update User
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    user.passwordReset = undefined; //Clear reset token
    user.refreshTokens.splice(0); // logout from all devices
    await user.save();
    console.log(
      `✅ Password reset successful for ${user.email} from IP: ${req.ip}`,
    );
    // 12. Optional: Send confirmation email
    // await sendPasswordChangedEmail(user.email, user.name);
    // 13. Return success
    res.status(200).json({
      message:
        "Password reset successful. Please login with your new password.",
      code: "PASSWORD_RESET_SUCCESS",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Failed to reset password",
      code: "SERVER_ERROR",
    });
  }
};
//# sourceMappingURL=auth.controller.js.map
