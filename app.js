import express from "express";
import cors from "cors";
import { productsRouter } from "./api/v1/products/products.js";
import { ordersRouter } from "./api/v1/orders/orders.js";
import dotenv from 'dotenv';

dotenv.config();

// Globals
const port = process.env.PORT || 3000;

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // parse incomming JSON
app.use(cors());

// Entry point
app.get(`/api/v1/`, (req, res) => {
  res.json({ message: "Nemlig.com API V1" });
});

app.use("/products", productsRouter);
app.use("/api/v1/orders", ordersRouter);

app.listen(port, (req, res) => {
  console.log(`The server is running on "http://localhost:${port}/api/v1"`);
});
