import express from "express";

import { OrderController } from "../Controllers/index.js";

const router = express.Router();

router.get("/", OrderController.orders)
router.get("/latest", OrderController.latest)
router.get("/:id", OrderController.order)
router.get("/orderItem/:userId/:productId", OrderController.orderItem)
router.post("/createOrder", OrderController.createOrder)
router.patch("/updateOrder/:userId/:orderItemId", OrderController.createOrder)
export default router