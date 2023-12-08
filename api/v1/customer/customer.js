import express from "express";
import customerController from "./customerController.js";

const customerRouter = express.Router();

customerRouter.get("/", customerController.getCustomer);

export { customerRouter };
