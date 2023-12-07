import express from "express";
import authController from "./authController.js";
import rateLimit from "express-rate-limit";

const authRouter = express.Router();

// Rate limiting to avoid bruce force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per windowMs
  message: {
    message: "Too many failed login attempts, please try again later.",
  },
});

authRouter.post("/login", authController.loginUser);
authRouter.post("/register", authController.registerUser);
authRouter.get("/logout", authController.logoutUser);
authRouter.get("/refresh", authController.refreshToken);

export { authRouter };
