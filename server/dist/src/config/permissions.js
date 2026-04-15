export const ROLES = {
    ADMIN: "admin",
    USER: "user"
};
export const PERMISSIONS = {
    USER_READ: "user:read",
    USER_UPDATE: "user:update",
    USER_DELETE: "user:delete"
};
export const ROLE_PERMISSIONS = {
    admin: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_UPDATE,
        PERMISSIONS.USER_DELETE
    ],
    user: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_UPDATE
    ]
};
//# sourceMappingURL=permissions.js.map