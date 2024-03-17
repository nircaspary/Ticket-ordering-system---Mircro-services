import { IOrderCreatedEvent, Subjects } from "@ticketing-nir/common";
import Listener from "@ticketing-nir/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  queueGroupName: string = queueGroupName;
  readonly subject = Subjects.OrderCreated;
  async onMessage(data: IOrderCreatedEvent["data"], msg: Message): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("No Ticket Found");
    }
    ticket.set({ orderId: data.id });
    await ticket.save();
    const { title, id, price, userId, version, orderId } = ticket;
    await new TicketUpdatedPublisher(this.client).publish({ title, id, price, userId, version, orderId });
    msg.ack();
  }
}
