import express from "express";
import cors from "cors";
import { startCronJob, scrapeCronJob } from "./api/v1/pricematch/cronJob.js";
import { productsRouter } from "./api/v1/products/products.js";
import { cartRouter } from "./api/v1/cart/cart.js";
import { favoritesRouter } from "./api/v1/favorites/favorites.js";
import { authRouter } from "./api/v1/authentication/auth.js";
import { ordersRouter } from "./api/v1/orders/orders.js";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./docs/swaggerOptions.js";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/authToken.js";
import { customerRouter } from "./api/v1/customer/customer.js";
import { pricematchRouter } from "./api/v1/pricematch/pricematch.js";
dotenv.config();

// Start cronjob for pricematching
startCronJob();

// Start cronjob for scraping products
scrapeCronJob();

// Globals
const port = process.env.PORT || 3000;

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // parse incomming JSON

// Allow Requests from frontend
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(cookieParser());

// Entry point
app.get(`/api/v1/`, (req, res) => {
  res.json({ message: "Nemlig.com API V1" });
});
app.use("/api/v1/customers", authenticateToken, customerRouter);
app.use("/api/v1/cart", authenticateToken, cartRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/favorites", authenticateToken, favoritesRouter);
app.use("/api/v1/orders", authenticateToken, ordersRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1/pricematch", pricematchRouter);

app.listen(port, (req, res) => {
  console.log(`The server is running on "http://localhost:${port}/api/v1"`);
});
