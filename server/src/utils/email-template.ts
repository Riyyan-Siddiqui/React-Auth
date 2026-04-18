export const generateVerificationEmail = (name: string, otp: string) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Welcome to Our App, ${name}!</h2>
    <p>Thank you for signing up. To complete your registration, please verify your email by entering the OTP below:</p>

    <div style="margin: 20px 0; padding: 15px; text-align: center; background-color: #fff; border: 1px dashed #ccc; border-radius: 5px; font-size: 20px; font-weight: bold;">
      ${otp}
    </div>

    <p style="color: #555;">This OTP is valid for <strong>1 minute</strong>. If you didn't request this, please ignore this email.</p>

    <p>Thanks,<br/>The Team</p>
  </div>
  `;
};

// utils/email-templates.ts

export const passwordResetEmail = (name: string, resetToken: string) => {
  // In production, this would be your frontend URL
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173/"}/reset-password?token=${resetToken}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: #fff; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .button { 
          display: inline-block; 
          background: #4F46E5; 
          color: #ffffff !important; 
          padding: 12px 30px; 
          text-decoration: none !important; 
          border-radius: 5px;
          margin: 20px 0;
          cursor: pointer;
        }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        .warning { 
          background: #FEF3C7; 
          border-left: 4px solid #F59E0B; 
          padding: 15px; 
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="background: white; padding: 10px; word-break: break-all;">
            ${resetUrl}
          </p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0;">
              <li>This link expires in <strong>1 hour</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password won't change unless you click the link above</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <p>Best regards,<br>Your App Team</p>
        </div>
        
        <div class="footer">
          <p>This email was sent to you because a password reset was requested for your account.</p>
          <p>If you didn't make this request, please contact support immediately.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
