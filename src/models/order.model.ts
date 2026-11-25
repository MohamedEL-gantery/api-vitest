import { Schema, model } from "mongoose";
import { COURIERS, ORDER_STATUSES } from "../constants/order.constants.js";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "quantity must be an integer",
      },
    },
  },
  { _id: false },
);

const orderSchema = new Schema({
  status: {
    type: String,
    enum: ORDER_STATUSES,
    default: "PENDING",
    required: true,
    index: true,
  },
  courier: {
    type: String,
    enum: COURIERS,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  products: {
    type: [productSchema],
    validate: {
      validator: (products: unknown[]) => products.length > 0,
      message: "An order needs at least one product",
    },
  },
});

export const Order = model("Order", orderSchema);
