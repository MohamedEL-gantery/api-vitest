import express from "express";
import { errorHandler } from "./middleware/error-handler.js";
import orderRouter from "./routes/order.routes.js";

export const app = express();

app.use(express.json());
app.use("/orders", orderRouter);
app.use(errorHandler);
