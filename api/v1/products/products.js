import express from "express";
import productsController from "./productsController.js";
import { authenticateToken } from "../../../middleware/authToken.js";

const productsRouter = express.Router();

// GET FOR AUTHENTICATED USERS
productsRouter.get("/authenticated", authenticateToken, productsController.getAuthenticatedProducts);

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
