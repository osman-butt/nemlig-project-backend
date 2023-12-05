import express from "express";
import cartController from "./cartController.js";

const cartRouter = express.Router();

cartRouter.get("/", cartController.getCart);

cartRouter.post("/", cartController.createCart);

cartRouter.put("/:id", cartController.updateCart);

cartRouter.delete("/:cart_id/:product_id", cartController.deleteCart);

export { cartRouter };
