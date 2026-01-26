// src/middleware/optionalAuth.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_SECRET } from "../config/env";
import { JwtPayload } from "../types/auth.types";

// For routes that work with or without auth
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.accessToken;

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET!) as JwtPayload;
    req.user = decoded;
  } catch (err) {
    // Silently fail for optional auth
  }

  next();
};