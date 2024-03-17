import { IOrderCreatedEvent, OrderStatus } from "@ticketing-nir/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // Create and save a ticket
  const ticket = Ticket.build({ title: "Concert", price: 20, userId: "sadf" });
  await ticket.save();
  // Create a fake data event
  const data: IOrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: "100",
    ticket: { id: ticket.id, price: ticket.price },
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("Sets the orderId of the ticket", async () => {
  const { data, listener, msg, ticket } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(data.id);
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
  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
