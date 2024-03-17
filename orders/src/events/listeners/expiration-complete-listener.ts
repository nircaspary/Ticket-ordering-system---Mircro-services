import { IExpirationCompleteEvent, OrderStatus, Subjects } from "@ticketing-nir/common";
import Listener from "@ticketing-nir/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

class ExpirationCompleteListener extends Listener<IExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;
  async onMessage(data: IExpirationCompleteEvent["data"], msg: Message): Promise<void> {
    const { orderId } = data;
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({ id: order.id, ticket: { id: order.ticket.id }, version: order.version });
    msg.ack();
  }
}
export default ExpirationCompleteListener;
