export const generateVerificationEmail = (name: string, otp: string) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Welcome to Our App, ${name}!</h2>
    <p>Thank you for signing up. To complete your registration, please verify your email by entering the OTP below:</p>

    <div style="margin: 20px 0; padding: 15px; text-align: center; background-color: #fff; border: 1px dashed #ccc; border-radius: 5px; font-size: 24px; letter-spacing: 4px; font-weight: bold;">
      ${otp}
    </div>

    <p style="color: #555;">This OTP is valid for <strong>1 minute</strong>. If you didn't request this, please ignore this email.</p>

    <p>Thanks,<br/>The Team</p>
  </div>
  `;
};
