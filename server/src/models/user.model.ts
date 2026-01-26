import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required!"],
      trim: true,
      minLength: [3, "User name must be at least 3 characters long"],
      maxLength: [50, "User name must be at most 50 characters long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    refreshTokens: [
      {
        token: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ], default: [],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
