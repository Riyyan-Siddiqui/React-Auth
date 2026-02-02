import jwt, {SignOptions} from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN, EMAIL_VERIFY_EXPIRES_IN, EMAIL_VERIFY_SECRET } from '../config/env';

export const generateAccessToken = (user: any) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        ACCESS_TOKEN_SECRET!,
        {expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN || "15m"}  as SignOptions
    );
};

export const generateRefreshToken = (user: any) => {
    return jwt.sign(
        {id: user._id},
        REFRESH_TOKEN_SECRET!,
        {expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN || "7d"} as SignOptions
    )
};

export const generateEmailVerificationToken = (userId: string) => {
    return jwt.sign(
        { sub: userId, type: "email_verification"},
        EMAIL_VERIFY_SECRET!,
        {expiresIn: EMAIL_VERIFY_EXPIRES_IN || "10m"} as SignOptions
    )
}