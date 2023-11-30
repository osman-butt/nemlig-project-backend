import express from "express";
import authController from "./authController.js";

const authRouter = express.Router();

authRouter.post("/login", authController.loginUser);
authRouter.post("/register", authController.registerUser);
authRouter.get("/logout", authController.logoutUser);

export { authRouter };
