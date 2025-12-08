import user from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// --- GET USER BY JNANAGNI ID (For Scanner) ---
export const getUserByJnanagniId = asyncHandler(async (req, res) => {
    const { jnanagniId } = req.params;

    if (!jnanagniId) {
        throw new ApiError(400, "Jnanagni ID is required");
    }

    const foundUser = await user.findOne({ jnanagniId }).select("-password -resetPasswordToken -__v");

    if (!foundUser) {
        throw new ApiError(404, "User not found with this ID");
    }

    res.status(200).json(
        new ApiResponse(200, foundUser, "User details fetched successfully")
    );
});

// --- TOGGLE PAYMENT STATUS (For Admin/Scanner) ---
export const verifyPayment = asyncHandler(async (req, res) => {
    const { jnanagniId, status } = req.body; // status: 'verified'

    const updatedUser = await user.findOneAndUpdate(
        { jnanagniId },
        { paymentStatus: status || 'verified' },
        { new: true }
    );

    res.status(200).json(
        new ApiResponse(200, updatedUser, "Payment status updated")
    );
});