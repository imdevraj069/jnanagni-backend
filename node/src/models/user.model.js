import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Native Node module for random bytes

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      // Simple regex for complexity
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v);
        },
        message: "Password must contain uppercase, lowercase, and number",
      },
    },
    role: {
      type: String,
      enum: [
        "student",
        "gkvian",
        "admin",
        "coordinator",
        "volunteer",
        "faculty",
      ],
      default: "student",
    },

    jnanagniId: {
      type: String,
      unique: true,
      uppercase: true, // Force uppercase for consistency
      trim: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },
    // Fields for Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate Access Token
userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET || "BLACKBIRDCODELABS",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d", // Matched cookie expiry preference
    }
  );
};

// // Method to generate Password Reset Token
// userSchema.methods.getResetPasswordToken = function () {
//     // Generate token
//     const resetToken = crypto.randomBytes(20).toString('hex');

//     // Hash token and set to resetPasswordToken field
//     this.resetPasswordToken = crypto
//         .createHash('sha256')
//         .update(resetToken)
//         .digest('hex');

//     // Set expire (10 minutes)
//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//     return resetToken;
// };

// --- NEW OTP GENERATOR ---
userSchema.methods.generateResetOtp = function () {
  // 1. Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Hash it before saving to DB (Security best practice)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // 3. Set expiry (e.g., 10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // 4. Return the plain OTP to send in email
  return otp;
};

const User = mongoose.model("User", userSchema);
export default User;
