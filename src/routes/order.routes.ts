import { Router } from "express";
import {
  createOrderController,
  getAllOrdersController,
} from "../controllers/order.controller.js";

const router = Router();

router.get("/", getAllOrdersController);
router.post("/", createOrderController);

export default router;
