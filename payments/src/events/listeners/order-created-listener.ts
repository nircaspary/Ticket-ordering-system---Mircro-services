import { IOrderCreatedEvent, Subjects } from "@ticketing-nir/common";
import Listener from "@ticketing-nir/common/build/events/base-listener";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  queueGroupName: string = queueGroupName;
  readonly subject = Subjects.OrderCreated;
  async onMessage(data: IOrderCreatedEvent["data"], msg: Message): Promise<void> {
    const order = Order.build({ id: data.id, price: data.ticket.price, status: data.status, userId: data.userId, version: data.version });
    await order.save();
    msg.ack();
  }
}
