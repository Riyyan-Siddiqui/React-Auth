import { ROLE_PERMISSIONS } from "../config/permissions.js";
export const authorize = (...requiredPermissions) => {
    return (req, res, next) => {
        // Check if user is authenticated
        if (!req.user) {
            res.status(401).json({
                message: "Not authenticated",
                code: "NO_USER"
            });
            return;
        }
        const userRole = req.user.role;
        const permissions = ROLE_PERMISSIONS[userRole];
        // Validate role exists
        if (!permissions) {
            res.status(403).json({
                message: "Invalid user role",
                code: "INVALID_ROLE"
            });
            return;
        }
        // Check if user has ALL required permissions (can be OR logic too)
        const hasAllPermissions = requiredPermissions.every(perm => permissions.includes(perm));
        if (!hasAllPermissions) {
            res.status(403).json({
                message: "Insufficient permissions",
                code: "FORBIDDEN",
                required: requiredPermissions
            });
            return;
        }
        next();
    };
};
// Alternative: OR logic (user needs ANY of the permissions)
export const authorizeAny = (...requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const userRole = req.user.role;
        const permissions = ROLE_PERMISSIONS[userRole];
        if (!permissions) {
            res.status(403).json({ message: "Invalid user role" });
            return;
        }
        const hasAnyPermission = requiredPermissions.some(perm => permissions.includes(perm));
        if (!hasAnyPermission) {
            res.status(403).json({
                message: "Insufficient permissions",
                required: requiredPermissions
            });
            return;
        }
        next();
    };
};
//# sourceMappingURL=authorize.middleware.js.map