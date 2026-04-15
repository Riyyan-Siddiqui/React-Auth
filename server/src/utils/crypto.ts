import crypto from "crypto";

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};


export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const hashOTP = (otp: string) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export const generateResetToken = (): string => {
  // Generating 32 random bytes and then converting it into hex 
  // (64 characters)
  return crypto.randomBytes(32).toString('hex');
}

export const hashResetToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
}