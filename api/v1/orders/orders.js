import express from "express";
import ordersController from "./ordersController.js";

const ordersRouter = express.Router();

// GET
ordersRouter.get("/", ordersController.getOrders);

// POST Order
ordersRouter.post("/", ordersController.createOrderItems);

export { ordersRouter };
