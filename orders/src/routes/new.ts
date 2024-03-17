import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@ticketing-nir/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";

import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();
router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("TicketId must be provided")],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return next(new NotFoundError());
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      return next(new BadRequestError("This ticket is already reserved"));
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({ userId: req.currentUser!.id, status: OrderStatus.Created, expiresAt: expiration, ticket });
    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      expiresAt: order.expiresAt.toISOString(),
      id: order.id,
      status: order.status,
      ticket: { id: order.ticket.id, price: order.ticket.price },
      userId: order.userId,
      version: order.version,
    });

    res.status(201).send(order);
  }
);
export { router as createOrderRouter };
