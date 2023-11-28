import express from "express";
import cartController from "./cartController.js";

const cartRouter = express.Router();

cartRouter.get("/", cartController.getCart);

export { cartRouter };
