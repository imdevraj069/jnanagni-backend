import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

export const authRouter = Router();

// Route for user registration
authRouter
  .route("/register")
  .post(register)
  .get((req, res) => {
    res.status(200).json({
      message: "Auth API is working. Use POST to register.",
    });
  });
