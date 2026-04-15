import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN, EMAIL_VERIFY_EXPIRES_IN, EMAIL_VERIFY_SECRET } from '../config/env';
export const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN || "1m" });
};
export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN || "7d" });
};
export const generateEmailVerificationToken = (userId) => {
    return jwt.sign({ sub: userId, type: "email_verification" }, EMAIL_VERIFY_SECRET, { expiresIn: EMAIL_VERIFY_EXPIRES_IN || "10m" });
};
//# sourceMappingURL=jwt.js.map