import nodemailer from "nodemailer";
import { SMTP_PASS } from "./env.js";

export const accountEmail = "riyyan.s.24@gmail.com";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: accountEmail,
    pass: SMTP_PASS,
  },
});
