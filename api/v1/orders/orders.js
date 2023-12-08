import express from "express";
import ordersController from "./ordersController.js";

const ordersRouter = express.Router();

// GET
ordersRouter.get("/", ordersController.getOrders);

//
ordersRouter.get("/inventory", ordersController.getInventory);

// POST
// ordersRouter.post("/", ordersController.createOrder);
// POST
ordersRouter.post("/", ordersController.createOrderItems);

export { ordersRouter };
