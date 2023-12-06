import express from "express";
import cartController from "./cartController.js";

const cartRouter = express.Router();

cartRouter.get("/", cartController.getCart);
cartRouter.post("/", cartController.createCartItems);

// cartRouter.post("/", cartController.createCartItem);

// cartRouter.put("/:id", cartController.updateCart);

// cartRouter.delete("/:cart_id/:product_id", cartController.deleteCart);
cartRouter.delete("/items", cartController.deleteAllCartItems);

export { cartRouter };
