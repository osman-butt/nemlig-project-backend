import express from "express";
import favoritesController from "./favoritesController.js";

const favoritesRouter = express.Router();

// GET
favoritesRouter.get("/", favoritesController.getFavorites);
favoritesRouter.get("/search", favoritesController.searchFavorites);

// POST
favoritesRouter.post("/", favoritesController.postFavorite);

// DELETE
favoritesRouter.delete("/:id", favoritesController.deleteFavorite);

export { favoritesRouter };
