import express from "express";
import ordersController from "./ordersController.js";

const ordersRouter = express.Router();

// GET
ordersRouter.get("/", ordersController.getOrders);

// POST
ordersRouter.post("/", ordersController.createOrder);

export { ordersRouter };
