export const isOwner = (param = 'id') => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                message: "Not authenticated",
                code: "NO_USER"
            });
            return;
        }
        const resourceId = req.params[param];
        if (!resourceId) {
            res.status(400).json({
                message: `Resource parameter '${param}' not found`,
                code: "MISSING_PARAM"
            });
            return;
        }
        // Allow admins to bypass owner check
        if (req.user.role === "admin") {
            next();
            return;
        }
        // Compare IDs (normalize to string for safety)
        if (req.user.id.toString() !== resourceId.toString()) {
            res.status(403).json({
                message: "Access denied - not resource owner",
                code: "NOT_OWNER"
            });
            return;
        }
        next();
    };
};
// // Alternative: Check ownership from database
// export const isResourceOwner = (
//   resourceType: 'post' | 'comment' | 'profile',
//   param: string = 'id'
// ) => {
//   return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     if (!req.user) {
//       res.status(401).json({ message: "Not authenticated" });
//       return;
//     }
//     const resourceId = req.params[param];
//     try {
//       // This would check actual DB ownership
//       // const resource = await db.findResource(resourceType, resourceId);
//       // if (resource.userId !== req.user.id && req.user.role !== 'admin') {
//       //   res.status(403).json({ message: "Not resource owner" });
//       //   return;
//       // }
//       next();
//     } catch (error) {
//       res.status(500).json({ message: "Error checking ownership" });
//     }
//   };
// };
//# sourceMappingURL=ownership.middleware.js.map