import User from "../models/user.model";
import { IUser, RefreshToken } from "../types/auth.types";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateEmailVerificationToken, generateRefreshToken } from "../utils/jwt";
import { Response, Request, NextFunction } from "express";
import { generateOTP, hashOTP, hashToken } from "../utils/crypto";
import { sendOTPEmail } from "../utils/send-email";
import { EMAIL_VERIFY_SECRET } from "../config/env";
import jwt from "jsonwebtoken";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

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

    // 3. Validate password strenght
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
        code: "WEAK_PASSWORD",
      });
    }

    // 4. Explict Check: Does user already exist?
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
        code: "EMAIL_EXISTS",
      });
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

    const verificationToken = generateEmailVerificationToken(user._id.toString());

  // 8. Send OTP email
  await sendOTPEmail(user.email, otp, verificationToken);  

  //   // 7. Generate tokens (if auto login after signup)
  //   const accessToken = generateAccessToken(user);
  //   const refreshToken = generateRefreshToken(user);
  //   const hashedRefreshToken = hashToken(refreshToken);

  //   user.refreshTokens.push({
  //     token: hashedRefreshToken,
  //     createdAt: new Date(),
  //   });

  //   await user.save();

  //   // Set cookies
  //   res.cookie("refreshToken", refreshToken, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "strict",
  //     maxAge: 7 * 24 * 60 * 60 * 1000,
  //   });

  //   res.status(201).json({
  //     accessToken,
  //     message: "User created Successfully",
  //     user: {
  //       id: user._id,
  //       name: user.name,
  //       email: user.email,
  //       role: user.role,
  //     },
  //   });
  // } catch (error) {
  //   res.status(500).json({ message: "Signup Failed" });
  // }

  res.status(201).json({
    message: "Signup successful. Please verify email using OTP",
    verificationToken, // Frontend stores temporary in memory not in local storage.
  });
  } catch (error) {
    res.status(500).json({message: "Signup Failed"});
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);

  if(!user) return res.sendStatus(404);

  if (user.emailVerified) res.status(400).json({message: "Already verified"})

    const otpData = user.emailOTP!;

    if (otpData.lockedUntil && otpData.lockedUntil > new Date()) {
      return res.status(429).json({
        message: "Too many attempts. Try Later."
      })
    }

    if (otpData.resendCount >= 3) {
      otpData.lockedUntil = new Date(Date.now() + 15*60*1000); //15 min lock
      await user.save();

      return res.status(429).json({message: "Too many OTP requests. Locked for 15 minutes"})
    }

    const otp = generateOTP();

    otpData.code = hashOTP(otp);
    otpData.expiresAt = new Date(Date.now() + 60 * 1000) // 1 min
    otpData.resendCount += 1;

    const verificationToken = generateEmailVerificationToken(user._id.toString());

    await user.save();
    await sendOTPEmail(user.email, otp, verificationToken);

    res.json({message: "OTP resent successfully", verificationToken});
}

export const logIn = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({ message: "Invalid Credentials" });

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid Credentials" });

  user.refreshTokens.splice(0);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // user.refreshToken = refreshToken;
  user.refreshTokens.push({
    token: hashToken(refreshToken),
    createdAt: new Date(),
  });
  await user.save();

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const hashedToken = hashToken(refreshToken);

  const user = (await User.findOne({
    "refreshTokens.token": hashedToken,
  })) as IUser | null;
  if (!user) {
    // Token reuse detected
    await User.updateMany(
      { "refreshTokens.token": hashedToken },
      { $set: { refreshTokens: [] } },
    );

    return res
      .status(403)
      .clearCookie("refreshToken")
      .json({ message: "Token reuse detected. Logged Out everywhere" });
  }
  // return res.sendStatus(403); sendStatus is as equals to res.status(404).send("No page found")

  // Rotate Token
  // Remove used refresh tokens

  user.refreshTokens = user.refreshTokens.filter(
    (t: RefreshToken) => t.token !== hashedToken,
  );

  // Generate new refresh token
  const newRefreshToken = generateRefreshToken(user);
  const newHasedToken = hashToken(newRefreshToken);

  user.refreshTokens.push({
    token: newHasedToken,
    createdAt: new Date(),
  });

  await user.save();

  // Send new tokens
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken: generateAccessToken(user),
  });
};

export const logOut = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await User.updateOne(
      { "refreshTokens.token": hashToken(refreshToken) },
      { $pull: { refreshToken: { token: hashToken(refreshToken) } } },
    );
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged Out Successfully" });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user is set by authenticate middleware
    const user = await User.findById(req.user!.id).select(
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

export const verifyCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  const { otp, verificationToken } = req.body;

  if (!otp || !verificationToken)
    return res.status(400).json({message: "OTP and token required."});

  let payload: any;

  try{
    payload = jwt.verify(
      verificationToken,
      EMAIL_VERIFY_SECRET!
    );
  } catch {
    return res.status(401).json({message: "Invalid or expired token"});
  }

  if (payload.type !== "email_verification")
    return res.json(403).json({message: "Invalid token scope"});

  const user = await User.findById(payload.sub);
  if (!user) return res.status(404);

  if (user.emailVerified) {
    return res.status(400).json({message: "Email already verified"})
  }

  const emailOTP = user.emailOTP;

  if(!emailOTP) {
    return res.status(400).json({
      message: "OTP not found"
    })
  }

  // lock check 
  if (emailOTP.lockedUntil && emailOTP.lockedUntil.getTime() > Date.now()) {
    return res.status(429).json({
      message: "Too many attempts. Please try again later."
    })
  }

  // Expiry Check
  if (emailOTP.expiresAt!.getTime() < Date.now()) {
    return res.status(400).json({
      message: "OTP expired",
    });
  }

  // OTP mismatch
  if(emailOTP.code !== hashOTP(otp)){
    emailOTP.attempts += 1;

    if(emailOTP.attempts >= 3) {
      emailOTP.lockedUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 mins
      emailOTP.attempts = 0;
    }

    await user.save();

    return res.status(400).json({
      message: "Invlaid OTP"
    })
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
  });

  await user.save();

  // set refresh cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    message: "Email verified successfully",
  });
};

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const setPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
