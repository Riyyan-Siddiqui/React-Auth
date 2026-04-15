import mongoose from "mongoose";
declare const User: mongoose.Model<{
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    emailVerified: boolean;
    refreshTokens: mongoose.Types.DocumentArray<{
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }> & {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }>;
    failedLoginAttempts: number;
    emailOTP?: {
        attempts: number;
        resendCount: number;
        expiresAt?: NativeDate | null | undefined;
        code?: string | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    passwordReset?: {
        attempts: number;
        token?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    lockUntil?: NativeDate | null | undefined;
    lastLogin?: NativeDate | null | undefined;
    passwordChangedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    emailVerified: boolean;
    refreshTokens: mongoose.Types.DocumentArray<{
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }> & {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }>;
    failedLoginAttempts: number;
    emailOTP?: {
        attempts: number;
        resendCount: number;
        expiresAt?: NativeDate | null | undefined;
        code?: string | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    passwordReset?: {
        attempts: number;
        token?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    lockUntil?: NativeDate | null | undefined;
    lastLogin?: NativeDate | null | undefined;
    passwordChangedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    emailVerified: boolean;
    refreshTokens: mongoose.Types.DocumentArray<{
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }> & {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }>;
    failedLoginAttempts: number;
    emailOTP?: {
        attempts: number;
        resendCount: number;
        expiresAt?: NativeDate | null | undefined;
        code?: string | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    passwordReset?: {
        attempts: number;
        token?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    lockUntil?: NativeDate | null | undefined;
    lastLogin?: NativeDate | null | undefined;
    passwordChangedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    emailVerified: boolean;
    refreshTokens: mongoose.Types.DocumentArray<{
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }> & {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }>;
    failedLoginAttempts: number;
    emailOTP?: {
        attempts: number;
        resendCount: number;
        expiresAt?: NativeDate | null | undefined;
        code?: string | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    passwordReset?: {
        attempts: number;
        token?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    lockUntil?: NativeDate | null | undefined;
    lastLogin?: NativeDate | null | undefined;
    passwordChangedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    emailVerified: boolean;
    refreshTokens: mongoose.Types.DocumentArray<{
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }> & {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }>;
    failedLoginAttempts: number;
    emailOTP?: {
        attempts: number;
        resendCount: number;
        expiresAt?: NativeDate | null | undefined;
        code?: string | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    passwordReset?: {
        attempts: number;
        token?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    lockUntil?: NativeDate | null | undefined;
    lastLogin?: NativeDate | null | undefined;
    passwordChangedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    emailVerified: boolean;
    refreshTokens: mongoose.Types.DocumentArray<{
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }> & {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }>;
    failedLoginAttempts: number;
    emailOTP?: {
        attempts: number;
        resendCount: number;
        expiresAt?: NativeDate | null | undefined;
        code?: string | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    passwordReset?: {
        attempts: number;
        token?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    lockUntil?: NativeDate | null | undefined;
    lastLogin?: NativeDate | null | undefined;
    passwordChangedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        name: string;
        email: string;
        password: string;
        role: "admin" | "user";
        emailVerified: boolean;
        refreshTokens: mongoose.Types.DocumentArray<{
            token: string;
            createdAt: NativeDate;
            expiresAt: NativeDate;
            deviceInfo?: {
                lastUsed: NativeDate;
                userAgent?: string | null | undefined;
                ip?: string | null | undefined;
            } | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            token: string;
            createdAt: NativeDate;
            expiresAt: NativeDate;
            deviceInfo?: {
                lastUsed: NativeDate;
                userAgent?: string | null | undefined;
                ip?: string | null | undefined;
            } | null | undefined;
        }> & {
            token: string;
            createdAt: NativeDate;
            expiresAt: NativeDate;
            deviceInfo?: {
                lastUsed: NativeDate;
                userAgent?: string | null | undefined;
                ip?: string | null | undefined;
            } | null | undefined;
        }>;
        failedLoginAttempts: number;
        emailOTP?: {
            attempts: number;
            resendCount: number;
            expiresAt?: NativeDate | null | undefined;
            code?: string | null | undefined;
            lockedUntil?: NativeDate | null | undefined;
        } | null | undefined;
        passwordReset?: {
            attempts: number;
            token?: string | null | undefined;
            expiresAt?: NativeDate | null | undefined;
            lockedUntil?: NativeDate | null | undefined;
        } | null | undefined;
        lockUntil?: NativeDate | null | undefined;
        lastLogin?: NativeDate | null | undefined;
        passwordChangedAt?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        name: string;
        email: string;
        password: string;
        role: "admin" | "user";
        emailVerified: boolean;
        refreshTokens: mongoose.Types.DocumentArray<{
            token: string;
            createdAt: NativeDate;
            expiresAt: NativeDate;
            deviceInfo?: {
                lastUsed: NativeDate;
                userAgent?: string | null | undefined;
                ip?: string | null | undefined;
            } | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            token: string;
            createdAt: NativeDate;
            expiresAt: NativeDate;
            deviceInfo?: {
                lastUsed: NativeDate;
                userAgent?: string | null | undefined;
                ip?: string | null | undefined;
            } | null | undefined;
        }> & {
            token: string;
            createdAt: NativeDate;
            expiresAt: NativeDate;
            deviceInfo?: {
                lastUsed: NativeDate;
                userAgent?: string | null | undefined;
                ip?: string | null | undefined;
            } | null | undefined;
        }>;
        failedLoginAttempts: number;
        emailOTP?: {
            attempts: number;
            resendCount: number;
            expiresAt?: NativeDate | null | undefined;
            code?: string | null | undefined;
            lockedUntil?: NativeDate | null | undefined;
        } | null | undefined;
        passwordReset?: {
            attempts: number;
            token?: string | null | undefined;
            expiresAt?: NativeDate | null | undefined;
            lockedUntil?: NativeDate | null | undefined;
        } | null | undefined;
        lockUntil?: NativeDate | null | undefined;
        lastLogin?: NativeDate | null | undefined;
        passwordChangedAt?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    emailVerified: boolean;
    refreshTokens: mongoose.Types.DocumentArray<{
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }> & {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }>;
    failedLoginAttempts: number;
    emailOTP?: {
        attempts: number;
        resendCount: number;
        expiresAt?: NativeDate | null | undefined;
        code?: string | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    passwordReset?: {
        attempts: number;
        token?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    lockUntil?: NativeDate | null | undefined;
    lastLogin?: NativeDate | null | undefined;
    passwordChangedAt?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    emailVerified: boolean;
    refreshTokens: mongoose.Types.DocumentArray<{
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }> & {
        token: string;
        createdAt: NativeDate;
        expiresAt: NativeDate;
        deviceInfo?: {
            lastUsed: NativeDate;
            userAgent?: string | null | undefined;
            ip?: string | null | undefined;
        } | null | undefined;
    }>;
    failedLoginAttempts: number;
    emailOTP?: {
        attempts: number;
        resendCount: number;
        expiresAt?: NativeDate | null | undefined;
        code?: string | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    passwordReset?: {
        attempts: number;
        token?: string | null | undefined;
        expiresAt?: NativeDate | null | undefined;
        lockedUntil?: NativeDate | null | undefined;
    } | null | undefined;
    lockUntil?: NativeDate | null | undefined;
    lastLogin?: NativeDate | null | undefined;
    passwordChangedAt?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default User;
//# sourceMappingURL=user.model.d.ts.map