import express from "express";
import pricematchController from "./pricematchController.js";

const pricematchRouter = express.Router();

// POST
pricematchRouter.post("/", pricematchController.createPriceMatchPrice);

export { pricematchRouter }