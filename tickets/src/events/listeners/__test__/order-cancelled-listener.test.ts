import { IOrderCancelledEvent } from "@ticketing-nir/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  // Create and save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ title: "Concert", price: 20, userId: "sadf" });
  ticket.set({ orderId });
  await ticket.save();
  // Create a fake data event
  const data: IOrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: { id: ticket.id },
    version: 0,
  };
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, orderId };
};

it("Updates the ticket orderId to undefined", async () => {
  const { data, listener, msg, ticket } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(undefined);
});
it("Acks the message", async () => {
  const { data, listener, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure a ack was called
  expect(msg.ack).toHaveBeenCalled();
});
it("Publishes a ticket update event", async () => {
  const { data, listener, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
