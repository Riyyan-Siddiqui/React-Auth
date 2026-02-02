import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const emailOTPSchema = new mongoose.Schema(
  {
    code: { type: String },
    expiresAt: { type: Date },
    attempts: { type: Number, default: 0 },
    resendCount: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /.+@.+\..+/,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailOTP: emailOTPSchema,

    refreshTokens: {
      type: [refreshTokenSchema],
      default: [],
    },
  },
  { timestamps: true }
);

/* 🔍 Index for refresh-token lookup */
userSchema.index({ "refreshTokens.token": 1 });

const User = mongoose.model("User", userSchema);
export default User;
