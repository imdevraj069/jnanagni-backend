import { Router } from "express";
import { getUserByJnanagniId, verifyPayment } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // Ensure scanner is logged in as admin/volunteer
import { authorize } from "../middlewares/access.middleware.js"; // Helper created in Part 1
import User from "../models/user.model.js"; // Import model directly for simple queries

export const userRouter = Router();

// Route for the Android Scanner
// Example: GET /api/v1/users/scan/JG25-X9Y2
userRouter.get("/scan/:jnanagniId", getUserByJnanagniId);

// Route to verify payment
userRouter.post("/verify-payment", protect, verifyPayment);



// --- ADMIN ROUTES ---

// 1. Get All Users
userRouter.get("/all", protect, authorize('admin'), async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
});

// 2. Change Role
userRouter.put("/role/:id", protect, authorize('admin'), async (req, res) => {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });
    res.status(200).json({ success: true, message: "Role updated" });
});