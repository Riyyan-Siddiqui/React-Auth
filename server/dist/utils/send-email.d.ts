export declare function sendOTPEmail(to: string, name: string, otp: string): Promise<{
    success: boolean;
    messageId: string;
}>;
export declare const sendPasswordResetEmail: (to: string, name: string, resetToken: string) => Promise<void>;
//# sourceMappingURL=send-email.d.ts.map