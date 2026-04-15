import nodemailer from "nodemailer";
import { generateVerificationEmail, passwordResetEmail } from "./email-template.js";
import { accountEmail, transporter } from "../config/nodemailer.js";

export async function sendOTPEmail (to: string, name: string, otp: string) {

    const mailOptions = {
        from: `REACT_AUTH <${accountEmail}>`,
        to,
        subject: "Verify Your Email - OTP Code",
        html: generateVerificationEmail(name, otp),
    };

    try{
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${info.response}`);
        return {success: true, messageId: info.messageId};
    } catch(err) {
        console.error(`Error sending email to ${to}:`, err);
        throw new Error("Failed to send verification email");
    };
}

export const sendPasswordResetEmail = async (
  to: string, 
  name: string, 
  resetToken: string
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"REACT_AUTH" <noreply@yourapp.com>',
      to,
      subject: 'Password Reset Request',
      html: passwordResetEmail(name, resetToken)
    });
    console.log(`✅ Password reset email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};


// export const sendOTPEmail = async(email: string, otp: string, verificationToken: string) => {
//     console.log("OTP sent");
// }