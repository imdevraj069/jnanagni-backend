import user from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await user.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  // if email consist of .gkv.ac.in domain, assign role as 'gkvian'
  let role = "user";
  if (email.endsWith(".gkv.ac.in")) {
    role = "gkvian";
  }
  req.body.role = role;

  const newUser = new user({ name, email, password, role });
  await newUser.save();
  const createdUser = await user.findById(newUser._id).select("-password");

  const token = newUser.getAccessToken();
  res
    .status(201)
    .json(
      new ApiResponse(
        true,
        201,
        { user: createdUser, token },
        "User registered successfully"
      )
    );
});
