import rateLimit from 'express-rate-limit';

// Strict rate limiting for authentication endpoint
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 mins
    max: 5, // 5 request per window
    message: {
        message: "Too many attempts from this IP, please try again 15 minutes",
        retryAfter: 15 // minutes
    },

    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    // skip successful requests (only count failures)
    skipSuccessfulRequests: false,
    // Custom key generator ( can be IP + user combo)
    keyGenerator: (req: any) => {
        return req.id || "unknown";
    }
});

// More lenient for singup (allow user to try different emails)
export const signupRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, //3 signups per hour per IP
    message: {
        message: "Too many account created from this IP, please try again after an hour",
        code: "SIGNUP_LIMIT_EXCEEDED"
    }
});

// OTP verification rate limiter
export const otpRateLimiter = rateLimit({
    windowMs: 10 * 10 * 1000, // 10 minutes
    max: 10, // 10 OTP attempts
    message: {
        message: "Too many OTP attempts, please try again later",
        code: "OTP_LIMIT_EXCEEDED"
    }
});

// Refresh token rate limitar (prevent token refresh spam)
export const refreshRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 refreshes per minute
    message: {
        message: "Too many token refresh requests",
        code: "REFRESH_LIMIT_EXCEEDED"
    }
});