import express from "express";
import productsController from "./productsController.js";
import { authenticateToken } from "../../../middleware/authToken.js";

const productsRouter = express.Router();

// GET LABELS
productsRouter.get("/labels", productsController.getLabels);

// GET CATEGORIES
productsRouter.get("/categories", productsController.getCategories);

// GET FOR AUTHENTICATED USERS
productsRouter.get("/authenticated", authenticateToken, productsController.getAuthenticatedProducts);
// SEARCH FOR AUTHENTICATED USERS
productsRouter.get("/authenticated/search", authenticateToken, productsController.searchAuthenticatedProducts);

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
