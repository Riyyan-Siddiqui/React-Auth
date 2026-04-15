export const validatePassword = (password) => {
    const errors = [];
    let strength = 'weak';
    // Length check
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long\n");
    }
    // Complexity checks
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter\n");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter\n");
    }
    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number\n");
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\';/~`]/.test(password)) {
        errors.push("Password must contain at least one special character\n");
    }
    // Common password check
    const commonPasswords = [
        'password', '12345678', 'qwerty', 'abc123', '123456',
        'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push("Password is too common, please choose a different one\n");
    }
    // Sequential or repeated characters
    if (/(.)\1{2,}/.test(password)) {
        errors.push("Password should not contain repeated characters (e.g., 'aaa')\n");
    }
    if (/(?:abc|bcd|cde|def|123|234|345|456|567|678|789)/i.test(password)) {
        errors.push("Password should not contain sequential characters\n");
    }
    // Calculate strength
    const strengthScore = [
        password.length >= 12,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /\d/.test(password),
        /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\';/~`]/.test(password),
        password.length >= 16,
    ].filter(Boolean).length;
    if (strengthScore >= 5)
        strength = 'strong';
    else if (strengthScore >= 3)
        strength = 'medium';
    else
        strength = 'weak';
    return {
        isValid: errors.length === 0,
        errors,
        strength
    };
};
//# sourceMappingURL=passwordValidator.js.map