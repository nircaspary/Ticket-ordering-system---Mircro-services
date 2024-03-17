import express from "express";
import { Order } from "../models/order";
import { NotAuthorizedError, NotFoundError, OrderStatus } from "@ticketing-nir/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();
router.delete("/api/orders/:orderId", async (req, res, next) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) {
    return next(new NotFoundError());
  }
  if (order.userId !== req.currentUser?.id) {
    return next(new NotAuthorizedError());
  }
  order.status = OrderStatus.Cancelled;
  await order.save();
  new OrderCancelledPublisher(natsWrapper.client).publish({ id: order.id, ticket: { id: order.ticket.id }, version: order.version });
  res.status(204).send(order);
});
export { router as deleteOrderRouter };
