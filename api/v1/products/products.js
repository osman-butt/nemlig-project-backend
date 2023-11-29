import express from "express";
import productsController from "./productsController.js";

const productsRouter = express.Router();

// GET
productsRouter.get("/", productsController.getProducts);
productsRouter.get("/search", productsController.searchProducts);
productsRouter.get("/:id", productsController.getProductById);

// POST
productsRouter.post("/", productsController.postProducts);

// PUT
productsRouter.put("/:id", productsController.updateProduct);

// DELETE
productsRouter.delete("/:id", productsController.deleteProduct);


export { productsRouter };
