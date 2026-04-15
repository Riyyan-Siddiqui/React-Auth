// src/middleware/optionalAuth.ts
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
// For routes that work with or without auth
export const optionalAuth = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        next();
        return;
    }
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;
    }
    catch (err) {
        // Silently fail for optional auth
    }
    next();
};
//# sourceMappingURL=optionalAuth.middleware.js.map