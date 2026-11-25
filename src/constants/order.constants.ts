export const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PACKED",
  "DELIVERED",
  "CANCELLED",
] as const;

// Invented courier names (practice only).
export const COURIERS = ["BOSTA", "INDRIVE", "OTHER"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type Courier = (typeof COURIERS)[number];
