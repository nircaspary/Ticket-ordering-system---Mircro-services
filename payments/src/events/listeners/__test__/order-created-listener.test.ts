import { IOrderCreatedEvent, OrderStatus } from "@ticketing-nir/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: IOrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: "100",
    ticket: { id: "adfsdf", price: 20 },
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("Replicates the order info", async () => {
  const { data, listener, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);
  expect(order?.price).toEqual(data.ticket.price);
});
it("Acks the message", async () => {
  const { data, listener, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure a ack was called
  expect(msg.ack).toHaveBeenCalled();
});
