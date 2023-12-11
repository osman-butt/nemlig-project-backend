import express from "express";
import productsController from "./productsController.js";
import { authenticateToken } from "../../../middleware/authToken.js";
import { authorizeAdminUser } from "../../../middleware/authorizeUser.js";

const productsRouter = express.Router();

// Update prices with pricematch // Set node cron job for this to run every 24 fx
productsRouter.post("/pricematch", productsController.createPriceMatchPrice)

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
productsRouter.post("/",authenticateToken, authorizeAdminUser, productsController.postProducts);

// PUT
productsRouter.put("/:id", authenticateToken, authorizeAdminUser, productsController.updateProduct);

// DELETE
productsRouter.delete("/:id", authenticateToken, authorizeAdminUser, productsController.deleteProduct);





export { productsRouter };
