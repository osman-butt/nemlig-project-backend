import express from "express";
import favoritesController from "./favoritesController.js";

const favoritesRouter = express.Router();

// GET
favoritesRouter.get("/", favoritesController.getFavorites);

export { favoritesRouter };
