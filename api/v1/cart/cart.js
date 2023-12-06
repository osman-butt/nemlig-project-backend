import express from "express";
import cartController from "./cartController.js";

const cartRouter = express.Router();

// Get customers cart
cartRouter.get("/", cartController.getCart);
// Add multiple items to cart
cartRouter.post("/", cartController.createCartItems);
// Add or deduct quantity from cart
cartRouter.put("/", cartController.updateCartItem);
// Delete all items from cart
cartRouter.delete("/items", cartController.deleteAllCartItems);

export { cartRouter };
