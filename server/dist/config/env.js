import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, EMAIL_VERIFY_SECRET, EMAIL_VERIFY_EXPIRES_IN, EMAIL_PASSWORD, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
// // config/env.js
// import dotenv from "dotenv";
// const result = dotenv.config({
//   path: ".env.development.local",
// });
// console.log("DOTENV RESULT:", result);
// console.log("PORT AFTER DOTENV:", process.env.PORT);
// export const {PORT} = process.env;
//# sourceMappingURL=env.js.map