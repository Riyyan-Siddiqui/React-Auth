import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    deviceInfo: {
      userAgent: String,
      ip: String,
      lastUsed: { type: Date, default: Date.now },
    },
  },
  { _id: false },
);

const emailOTPSchema = new mongoose.Schema(
  {
    code: { type: String },
    expiresAt: { type: Date },
    attempts: { type: Number, default: 0 },
    resendCount: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  { _id: false },
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
      // Limited number of concurrent sessions
      validate: {
        validator: function (tokens: any[]) {
          return tokens.length <= 5; // Max 5 devices
        },
        message: "Maximum 5 concurrent sessions allowed",
      },
    },

    passwordReset: {
      token: String,
      expiresAt: Date,
      attempts: { type: Number, default: 0 },
      lockedUntil: Date,
    },

    // Track failed login attempts
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    // Accout lockout
    lockUntil: {
      type: Date,
    },

    //Last login tracking
    lastLogin: {
      type: Date,
    },

    //Password change tracking
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

/* 🔍 Index for refresh-token lookup */
userSchema.index({ "refreshTokens.token": 1 });


// Virtual for checking if account is locked
userSchema.virtual("isLocked").get(function (this: any) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Method to clean expired refresh tokens
userSchema.methods.cleanExpiredTokens = async function () {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter(
    (token: any) => token.expiresAt > now,
  );
  await this.save();
};

// Method to increment failed login attempts
userSchema.methods.incrementLoginAttempts = async function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return await this.updateOne({
      $set: { failedLoginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  // Otherwise increment
  const updates: any = { $inc: { failedLoginAttempts: 1 } };

  // lock account after 5 failed attempts
  const maxAttempts = 5;
  const lockTime = 15 * 60 * 1000; //15 minutes

  if (this.failedLoginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + lockTime) };
  }

  return await this.updateOne(updates);
};

// Method to reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $set: {
      failedLoginAttempts: 0,
      lastLogin: new Date(),
    },
    $unset: { lockUntil: 1 },
  });
};

const User = mongoose.model("User", userSchema);
export default User;
