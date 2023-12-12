import express from "express";
import pricematchController from "./pricematchController.js";

const pricematchRouter = express.Router();

// POST
pricematchRouter.post("/", pricematchController.createPriceMatchPrice);

// POST to DB
pricematchRouter.post("/scrape", pricematchController.scrapeRemaProducts);

export { pricematchRouter };
