import express from "express";
import favoritesController from "./favoritesController.js";

const favoritesRouter = express.Router();

// GET
favoritesRouter.get("/", favoritesController.getFavorites);
favoritesRouter.get("/:id", favoritesController.getFavoriteById);

export { favoritesRouter };
