import { describe, it, expect, vi, beforeEach } from "vitest";

import { Order } from "../src/models/order.model.js";
import {
  createOrder,
  exportOrders,
  getAllOrders,
} from "../src/services/order.service.js";

vi.mock("../src/models/order.model.js", () => ({
  Order: { find: vi.fn(), create: vi.fn() },
}));

describe("order service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("get order service", () => {
    it("get all orders", async () => {
      vi.mocked(Order.find).mockResolvedValue([]);

      await getAllOrders({ status: "PENDING" });

      expect(Order.find).toHaveBeenCalledWith({ status: "PENDING" }, null, {
        sort: { createdAt: -1, _id: -1 },
      });
    });

    it("export order", async () => {
      vi.mocked(Order.find).mockResolvedValue([]);

      await exportOrders({ courier: "OTHER" });

      expect(Order.find).toHaveBeenCalledWith({ courier: "OTHER" }, null, {
        sort: { createdAt: -1, _id: -1 },
      });
    });

    it.each([
      {
        rejected: "invalid status",
        filter: { status: "test" },
        message: "not vaild data",
      },
      {
        rejected: "invalid courier",
        filter: { courier: "test" },
        message: "not vaild data",
      },
      {
        rejected: "invalid from (not a date)",
        filter: { from: "tomorrow" },
        message: "from must be a valid date",
      },
      {
        rejected: "invalid from (day doesn't exist)",
        filter: { from: "2026-02-31" },
        message: "from must be a valid date",
      },
      {
        rejected: "invalid to (not a date)",
        filter: { to: "1" },
        message: "to must be a valid date",
      },
      {
        rejected: "invalid to (no timezone)",
        filter: { to: "2026-01-01T10:00:00" },
        message: "to must be a valid date",
      },
      {
        rejected: "from after to",
        filter: { from: "2026-03-01", to: "2026-01-01" },
        message: "from must be earlier than or equal to to",
      },
    ])("get all orders validation: $rejected", async ({ filter, message }) => {
      await expect(getAllOrders(filter)).rejects.toThrow(message);
      expect(Order.find).not.toHaveBeenCalled();
    });
  });

  describe("create order service", () => {
    it("create order ", async () => {
      vi.mocked(Order.create).mockResolvedValue([]);

      await createOrder({
        courier: "INDRIVE",
        status: "PENDING",
        products: [
          {
            name: "test",
            price: 480,
            quantity: 1,
          },
        ],
      });

      expect(Order.create).toHaveBeenCalledWith({
        courier: "INDRIVE",
        status: "PENDING",
        products: [
          {
            name: "test",
            price: 480,
            quantity: 1,
          },
        ],
      });
    });

    it.each([
      {
        rejected: "courier",
        order: {
          status: "PENDING",
          products: [
            {
              name: "test",
              price: 480,
              quantity: 1,
            },
          ],
        },
        message: "courier is required",
      },
      {
        rejected: "invaild status",
        order: {
          courier: "INDRIVE",
          status: "test",
          products: [
            {
              name: "test",
              price: 480,
              quantity: 1,
            },
          ],
        },
        message: "not vaild data",
      },
      {
        rejected: "prices is 0 ",
        order: {
          status: "PENDING",
          courier: "INDRIVE",
          products: [
            {
              name: "test",
              price: 0,
              quantity: 1,
            },
          ],
        },
        message: "price must be a non-negative number",
      },
      {
        rejected: "quantity is 0",
        order: {
          status: "PENDING",
          courier: "INDRIVE",
          products: [
            {
              name: "test",
              price: 777,
              quantity: 0,
            },
          ],
        },
        message: "quantity must be an integer >= 1",
      },
      {
        rejected: "product is empty",
        order: {
          status: "PENDING",
          courier: "INDRIVE",
          products: [],
        },
        message: "products must be a non-empty array",
      },
      {
        rejected: "no body",
        order: null,
        message: "Request body must be a JSON object",
      },
      {
        rejected: "name is required",
        order: {
          status: "PENDING",
          courier: "INDRIVE",
          products: [
            {
              price: 110,
              quantity: 1,
            },
          ],
        },
        message: "name must be a non-empty string",
      },
      {
        rejected: "createAt invaild",
        order: {
          status: "PENDING",
          courier: "INDRIVE",
          createdAt: null,
          products: [
            {
              name: "test",
              price: 110,
              quantity: 1,
            },
          ],
        },
        message: "createdAt must be a valid date",
      },
    ])("create order validation: $rejected", async ({ order, message }) => {
      await expect(createOrder(order as never)).rejects.toThrow(message);
      expect(Order.create).not.toHaveBeenCalled();
    });
  });
});
