import User from "../models/user.model";
import { IUser, RefreshToken } from "../types/auth.types";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { Response, Request, NextFunction } from "express";
import { hashToken } from "../utils/crypto";

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

    // 6. Create User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // 7. Generate tokens (if auto login after signup)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const hashedRefreshToken = hashToken(refreshToken);

    user.refreshTokens.push({
      token: hashedRefreshToken,
      createdAt: new Date(),
    });

    await user.save();

    // Set cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      accessToken,
      message: "User created Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Signup Failed" });
  }
};

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
