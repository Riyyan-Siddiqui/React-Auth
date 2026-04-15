import { Request, Response, NextFunction } from "express";
import { Permission } from "../types/auth.types.js";
export declare const authorize: (...requiredPermissions: Permission[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const authorizeAny: (...requiredPermissions: Permission[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorize.middleware.d.ts.map