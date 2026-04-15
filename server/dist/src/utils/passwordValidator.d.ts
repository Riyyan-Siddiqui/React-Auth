interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
}
export declare const validatePassword: (password: string) => PasswordValidationResult;
export {};
//# sourceMappingURL=passwordValidator.d.ts.map