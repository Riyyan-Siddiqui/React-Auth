import nodemailer from "nodemailer";
import { generateVerificationEmail } from "./email-template";
import { accountEmail, transporter } from "../config/nodemailer";

export async function sendOTPEmail (to: string, name: string, otp: string) {

    const mailOptions = {
        from: accountEmail,
        to,
        subject: "Verify Your Email",
        html: generateVerificationEmail(name, otp),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error, 'Error sending email');
        }

        console.log('Email sent: ' + info.response);
    })
}


// export const sendOTPEmail = async(email: string, otp: string, verificationToken: string) => {
//     console.log("OTP sent");
// }