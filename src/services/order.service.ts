import { Order } from "../models/order.model.js";

import { AppError } from "../utils/AppError.js";

import { buildOrderFilter, type OrderFilters } from "../utils/order-filter.js";
import { parseDate, parseEnum } from "../utils/validation.js";
import {
  COURIERS,
  ORDER_STATUSES,
  type Courier,
  type OrderStatus,
} from "../constants/order.constants.js";

interface NewOrderProduct {
  name: string;
  price: number;
  quantity: number;
}

interface NewOrder {
  courier: Courier;
  products: NewOrderProduct[];
  status?: OrderStatus;
  createdAt?: Date;
}

const parseProducts = (value: NewOrderProduct[]): NewOrderProduct[] => {
  return value.map((item) => {
    if (typeof item !== "object" || item === null) {
      throw new AppError(`must be an object`);
    }

    const { name, price, quantity } = item;

    if (typeof name !== "string" || name.trim() === "") {
      throw new AppError(`name must be a non-empty string`);
    }
    if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
      throw new AppError(`price must be a non-negative number`);
    }
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new AppError(`quantity must be an integer >= 1`);
    }

    return { name: name.trim(), price, quantity };
  });
};

export const getAllOrders = async (filters: OrderFilters = {}) => {
  const query = buildOrderFilter(filters);
  return Order.find(query, null, { sort: { createdAt: -1, _id: -1 } });
};

export const exportOrders = async (filters: OrderFilters = {}) => {
  const query = buildOrderFilter(filters);
  return Order.find(query, null, { sort: { createdAt: -1, _id: -1 } });
};

export const createOrder = async (orderData: NewOrder) => {
  if (
    typeof orderData !== "object" ||
    orderData === null ||
    Array.isArray(orderData)
  ) {
    throw new AppError("Request body must be a JSON object");
  }

  if (!Array.isArray(orderData.products) || orderData.products.length === 0) {
    throw new AppError("products must be a non-empty array");
  }

  if (orderData.courier === undefined) {
    throw new AppError("courier is required");
  }

  const data: NewOrder = {
    courier: parseEnum(orderData.courier, COURIERS, "courier"),
    products: parseProducts(orderData.products),
  };

  if (orderData.status !== undefined) {
    data.status = parseEnum(orderData.status, ORDER_STATUSES, "status");
  }

  if (orderData.createdAt !== undefined) {
    data.createdAt = parseDate(orderData.createdAt, "createdAt", "start");
  }

  return Order.create(data);
};
