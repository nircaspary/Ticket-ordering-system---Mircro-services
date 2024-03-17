import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@ticketing-nir/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import TicketUpdatedPublisher from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [body("title").not().isEmpty().withMessage("Title is required"), body("price").isFloat({ gt: 0 }).withMessage("Price must be provided and must be greater than 0")],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new NotFoundError());
    }
    if (ticket.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }
    if (ticket.orderId) {
      return next(new BadRequestError("This ticket already has been reserved"));
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      userId: ticket.userId,
      title: ticket.title,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
