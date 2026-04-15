import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).json({
            message: "Not authenticated - No token provided",
            code: "NO_TOKEN",
        });
        return;
    }
    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        // Validate payload structure
        if (!decoded.id || !decoded.role) {
            res.status(401).json({
                message: "Invalid token payload",
                code: "INVALID_PAYLOAD",
            });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (err) {
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
//# sourceMappingURL=authenticate.middleware.js.map