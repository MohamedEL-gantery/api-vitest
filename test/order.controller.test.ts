import { afterAll, beforeAll, describe, expect, it, beforeEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import { exportOrders, getAllOrders } from "../src/services/order.service.js";
import { Order } from "../src/models/order.model.js";
import { app } from "../src/app.js";

describe("Order Controller", () => {
  let mongoServer: MongoMemoryServer;
  let server: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    server = app.listen(0);
  });

  afterAll(async () => {
    mongoServer.stop();
    mongoose.disconnect();
    server.close();
  });

  beforeEach(async () => {
    await Order.deleteMany({});
  });

  describe("order controller ", () => {
    describe("Post /order", () => {
      it("create order", async () => {
        const res = await request(app)
          .post("/orders")
          .send({
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
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("PENDING");
        expect(res.body.courier).toBe("INDRIVE");
        expect(await Order.countDocuments()).toBe(1);
      });
    });

    it("create order returns 400", async () => {
      const res = await request(app)
        .post("/orders")
        .send({
          courier: "INDRIVE",
          status: "PENDING",
          products: [
            {
              name: "test",
              price: 0,
              quantity: 1,
            },
          ],
        });

      // console.log(res.error);
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("price must be a non-negative number");
      expect(await Order.countDocuments()).toBe(0);
    });
  });

  const products = [{ name: "test", price: 480, quantity: 1 }];

  const seedOrders = async () => {
    const rows = [
      { courier: "INDRIVE", status: "PENDING", createdAt: "2026-01-10" },
      { courier: "INDRIVE", status: "PACKED", createdAt: "2026-01-31" },
      { courier: "BOSTA", status: "PACKED", createdAt: "2026-02-01" },
      { courier: "BOSTA", status: "DELIVERED", createdAt: "2026-02-15" },
    ];

    for (const row of rows) {
      const res = await request(app)
        .post("/orders")
        .send({ ...row, products });
      expect(res.status).toBe(201);
    }
  };

  describe("GET /orders", () => {
    it("filter by status", async () => {
      await seedOrders();

      const res = await request(app).get("/orders").query({ status: "PACKED" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("filter by date range", async () => {
      await seedOrders();

      const res = await request(app)
        .get("/orders")
        .query({ from: "2026-01-31", to: "2026-02-01" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    }, 30_000);

    it("get all returns 400", async () => {
      await seedOrders();

      const res = await request(app).get("/orders").query({ status: "test" });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("not vaild data");
    });
  });

  describe("parity", () => {
    it("getAllOrders and exportOrders return the same orders", async () => {
      await seedOrders();
      const filters = {
        status: "PACKED",
        from: "2026-01-01",
        to: "2026-02-01",
      };

      const getAll = (await getAllOrders(filters)).map((o) => String(o._id));
      const exportData = (await exportOrders(filters)).map((o) =>
        String(o._id),
      );

      expect(getAll).toEqual(exportData);
    });
  });
});
