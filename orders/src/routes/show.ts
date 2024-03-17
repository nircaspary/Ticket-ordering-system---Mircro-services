import express from "express";
import { Order } from "../models/order";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@ticketing-nir/common";
const router = express.Router();
router.get("/api/orders/:orderId", requireAuth, async (req, res, next) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) {
    return next(new NotFoundError());
  }
  if (order.userId !== req.currentUser?.id) {
    return next(new NotAuthorizedError());
  }
  res.status(200).send(order);
});
export { router as showOrderRouter };
