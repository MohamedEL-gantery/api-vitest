import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(400).json({ error: error.message });
    return;
  }

  console.log("err", error);
  res.status(500).json({ error: "Internal server error" });
};
