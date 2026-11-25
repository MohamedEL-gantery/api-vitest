import {
  COURIERS,
  ORDER_STATUSES,
  type Courier,
  type OrderStatus,
} from "../constants/order.constants.js";
import { AppError } from "./AppError.js";
import { parseDate, parseEnum } from "./validation.js";

export interface OrderFilters {
  status?: unknown;
  courier?: unknown;
  from?: unknown;
  to?: unknown;
}

export interface OrderQueryFilter {
  status?: OrderStatus;
  courier?: Courier;
  createdAt?: { $gte?: Date; $lte?: Date };
}

export const buildOrderFilter = (
  filters: OrderFilters = {},
): OrderQueryFilter => {
  const query: OrderQueryFilter = {};

  if (filters.status !== undefined) {
    query.status = parseEnum(filters.status, ORDER_STATUSES, "status");
  }

  if (filters.courier !== undefined) {
    query.courier = parseEnum(filters.courier, COURIERS, "courier");
  }

  const from =
    filters.from !== undefined
      ? parseDate(filters.from, "from", "start")
      : undefined;
  const to =
    filters.to !== undefined ? parseDate(filters.to, "to", "end") : undefined;

  if (from && to && from.getTime() > to.getTime()) {
    throw new AppError("from must be earlier than or equal to to");
  }

  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = from;
    if (to) query.createdAt.$lte = to;
  }

  return query;
};
