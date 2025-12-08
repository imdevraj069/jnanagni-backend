import { Router } from "express";
import { 
    register, 
    login, 
    getMe, 
    forgotPassword, 
    resetPassword 
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

// Public Routes
authRouter.post("/register", register);
authRouter.get("/register", (req, res) => {
    res.status(200).json({ message: "Register endpoint is working." });
});
authRouter.post("/login", login);

// Step 1: User sends email -> receives OTP
authRouter.post("/forgot-password", forgotPassword);

// Step 2: User sends { email, otp, password } -> password updated
authRouter.post("/reset-password", resetPassword);

// Protected Routes
authRouter.get("/me", protect, getMe);

authRouter.get("/", (req, res) => {
    res.status(200).json({ message: "Auth API is working." });
});