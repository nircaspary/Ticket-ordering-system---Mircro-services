import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";

import { ITicketUpdatedEvent } from "@ticketing-nir/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import TicketUpdatedListener from "../ticket-updated-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "Concert",
  });
  await ticket.save();
  // Create a fake data event
  const data: ITicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: 999,
    title: "Updated concert",
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds updates and saves a ticket", async () => {
  const { data, listener, msg, ticket } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.title).toEqual(data?.title);
  expect(updatedTicket?.price).toEqual(data?.price);
  expect(updatedTicket?.version).toEqual(data?.version);
});
it("Acks the message", async () => {
  const { data, listener, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure a ack was called
  expect(msg.ack).toHaveBeenCalled();
});
it("Does not call Ack if the event has a skipped version number", async () => {
  const { data, listener, msg } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
