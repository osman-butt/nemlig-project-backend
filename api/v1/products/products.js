import express from "express";
import productsController from "./productsController.js";

const productsRouter = express.Router();

// GET
productsRouter.get("/", productsController.getProducts);
productsRouter.get("/:id", productsController.getProductById);

// POST
productsRouter.post("/", productsController.postProducts);

// DELETE
productsRouter.delete("/:id", productsController.deleteProduct);


export { productsRouter };
