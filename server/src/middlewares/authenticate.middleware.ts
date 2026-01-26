// src/middleware/authenticate.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_SECRET } from "../config/env";
import { JwtPayload } from "../types/auth.types";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ 
      message: "Not authenticated",
      code: "NO_TOKEN" 
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET!) as JwtPayload;
    
    // Validate payload structure
    if (!decoded.id || !decoded.role) {
      res.status(401).json({ 
        message: "Invalid token payload",
        code: "INVALID_PAYLOAD" 
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        message: "Token expired",
        code: "TOKEN_EXPIRED" 
      });
      return;
    }
    
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        message: "Invalid token",
        code: "INVALID_TOKEN" 
      });
      return;
    }

    res.status(500).json({ 
      message: "Authentication error",
      code: "AUTH_ERROR" 
    });
  }
};