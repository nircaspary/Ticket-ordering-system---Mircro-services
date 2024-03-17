import { IOrderCancelledEvent, OrderStatus, Subjects } from "@ticketing-nir/common";
import Listener from "@ticketing-nir/common/build/events/base-listener";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<IOrderCancelledEvent> {
  queueGroupName: string = queueGroupName;
  readonly subject = Subjects.OrderCancelled;
  async onMessage(data: IOrderCancelledEvent["data"], msg: Message): Promise<void> {
    const { id, version } = data;
    const order = await Order.findByEvent({ id, version });
    if (!order) {
      throw new Error("No Order Found");
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
