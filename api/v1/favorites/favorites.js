import express from "express";
import favoritesController from "./favoritesController.js";

const favoritesRouter = express.Router();

// GET
favoritesRouter.get("/", favoritesController.getFavorites);
favoritesRouter.get("/search", favoritesController.searchFavorites);
favoritesRouter.get("/:id", favoritesController.getFavoriteById);

// POST
favoritesRouter.post("/", favoritesController.postFavorite);

// DELETE
favoritesRouter.delete("/", favoritesController.deleteFavorite);

export { favoritesRouter };
