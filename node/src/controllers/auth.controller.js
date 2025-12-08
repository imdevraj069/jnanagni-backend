import crypto from 'crypto';
import user from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sendWelcomeEmail, sendOtpEmail } from "../services/email.service.js";

const generateJnanagniId = () => {
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase(); // Generates 4 chars
  return `JGN26-${suffix}`;
};

// --- REGISTER ---
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, adminSecret } = req.body;
  
  const existingUser = await user.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  // --- UNIQUE ID GENERATION & CHECK ---
  let uniqueId;
  let isUnique = false;

  // Retry loop: Keep generating until we find one that doesn't exist
  while (!isUnique) {
    uniqueId = generateJnanagniId();
    
    // Check DB for existence
    const existingIdUser = await user.findOne({ jnanagniId: uniqueId });
    
    if (!existingIdUser) {
      isUnique = true; // Found a free ID, break the loop
    }
    // If it exists, the loop runs again automatically
  }

  // Determine Role
  let role = "student"; 
  if (email.endsWith(".gkv.ac.in")) role = "gkvian";

  if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
    role = "admin";
  }

  // Create User with the Unique ID
  const newUser = await user.create({ 
    name, 
    email, 
    password, 
    role,
    jnanagniId: uniqueId 
  });

  const createdUser = await user.findById(newUser._id).select("-password");
  const token = newUser.getAccessToken();

  // Send Welcome Email (Now includes the ID)
  try {
    await sendWelcomeEmail(email, name, uniqueId);
  } catch (error) {
    console.error("Email service failed:", error); 
  }

  res.status(201).json(
    new ApiResponse(201, { user: createdUser, token }, "User registered successfully")
  );
});

// --- LOGIN ---
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    throw new ApiError(400, "Please provide an email and password");
  }

  // Check for user
  // We need to explicitly select password because usually it's excluded
  const foundUser = await user.findOne({ email });

  if (!foundUser) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check if password matches
  const isMatch = await foundUser.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = foundUser.getAccessToken();
  const loggedInUser = await user.findById(foundUser._id).select("-password");

  res.status(200).json(
    new ApiResponse(200, { user: loggedInUser, token }, "User logged in successfully")
  );
});

// --- GET CURRENT USER (ME) ---
export const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  const currentUser = await user.findById(req.user.id).select("-password");

  res.status(200).json(
    new ApiResponse(200, { user: currentUser }, "User profile fetched successfully")
  );
});


// --- FORGOT PASSWORD (OTP Request) ---
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const userRecord = await user.findOne({ email });
  if (!userRecord) {
    throw new ApiError(404, "User not found");
  }

  // 1. Generate OTP
  const otp = userRecord.generateResetOtp();
  await userRecord.save({ validateBeforeSave: false });

  // 2. Send Email
  try {
    await sendOtpEmail(email, otp);
    
    res.status(200).json(
      new ApiResponse(200, {}, `Verification code sent to ${email}`)
    );
  } catch (err) {
    userRecord.resetPasswordToken = undefined;
    userRecord.resetPasswordExpire = undefined;
    await userRecord.save({ validateBeforeSave: false });
    throw new ApiError(500, "Failed to send verification email");
  }
});

// --- RESET PASSWORD (Verify OTP & Set New Password) ---
export const resetPassword = asyncHandler(async (req, res) => {
  // We need email, otp, and the new password
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    throw new ApiError(400, "Email, OTP, and new password are required");
  }

  // 1. Hash the incoming OTP to compare with DB
  const hashedOtp = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  // 2. Find user with:
  //    - Matching email
  //    - Matching hashed OTP
  //    - Expiry time in the future
  const userRecord = await user.findOne({
    email,
    resetPasswordToken: hashedOtp,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!userRecord) {
    throw new ApiError(400, "Invalid or expired verification code");
  }

  // 3. Update Password
  userRecord.password = password;
  userRecord.resetPasswordToken = undefined;
  userRecord.resetPasswordExpire = undefined;
  
  await userRecord.save();

  // 4. Auto-login (Optional) or just return success
  res.status(200).json(
    new ApiResponse(200, {}, "Password reset successfully. You can now login.")
  );
});



