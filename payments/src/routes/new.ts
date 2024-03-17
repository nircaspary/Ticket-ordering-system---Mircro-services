import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@ticketing-nir/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";

const router = express.Router();

router.post("/api/payments", requireAuth, [body("token").notEmpty(), body("orderId").notEmpty()], validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  const { token, orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new NotFoundError());
  }
  if (order.userId !== req.currentUser?.id) {
    return next(new NotAuthorizedError());
  }
  if (order.status === OrderStatus.Cancelled) {
    return next(new BadRequestError("This order has already been cancelled"));
  }
  const charge = await stripe.charges.create({
    amount: order.price * 100,
    currency: "usd",
    source: token,
  });
  const payment = Payment.build({ orderId, chargeId: charge.id });
  await payment.save();
  await new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    chargeId: payment.chargeId,
    orderId: payment.orderId,
  });
  res.status(201).send({ id: payment.id, message: "Payment created successfully" });
});

export { router as createChargeRouter };
