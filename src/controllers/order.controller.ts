import type { NextFunction, Request, Response } from "express";
import {
  createOrder,
  getAllOrders,
  exportOrders,
} from "../services/order.service.js";

export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, courier, from, to } = req.query;
    const orders = await getAllOrders({ status, courier, from, to });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const exportOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, courier, from, to } = req.query;
    const orders = await exportOrders({ status, courier, from, to });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};
