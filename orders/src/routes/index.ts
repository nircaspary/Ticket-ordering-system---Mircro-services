import express from "express";
import { Order } from "../models/order";
import { requireAuth } from "@ticketing-nir/common";
const router = express.Router();
router.get("/api/orders", requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.currentUser?.id }).populate("ticket");
  res.status(200).send(orders);
});
export { router as indexOrderRouter };
