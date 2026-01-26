// src/types/auth.types.ts
import { Types, Document } from 'mongoose';

export type UserRole = 'admin' | 'user';
export type Permission = 
  | 'users:read' 
  | 'users:write' 
  | 'users:delete'
  | 'posts:read'
  | 'posts:write'
  | 'posts:delete';

export interface JwtPayload {
  id: string;
  role: UserRole;
  email?: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export interface RefreshToken {
  token: string,
  createdAt: Date;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string,
  email: string,
  password: string,
  role: string;
  refreshTokens: RefreshToken[];
}