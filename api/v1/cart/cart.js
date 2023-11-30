import express from "express";
import cartController from "./cartController.js";

const cartRouter = express.Router();

cartRouter.get("/", cartController.getCart);

cartRouter.post("/", cartController.createCart);

cartRouter.delete("/:id", cartController.deleteCart);

export { cartRouter };
