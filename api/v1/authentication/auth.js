import express from "express";
import authController from "./authController.js";
// import  from "./authModel.js";

const authRouter = express.Router();

// GET
// authRouter.get("/register", async (req, res) => {
//   const customers = await getUsers();
//   res.send(customers);
// });

authRouter.post("/login", authController.loginUser);
authRouter.post("/register", authController.registerUser);
authRouter.get("/logout", authController.logoutUser);

export { authRouter };
