import { Message } from "node-nats-streaming";
import { ITicketCreatedEvent, Subjects } from "@ticketing-nir/common";
import Listener from "@ticketing-nir/common/build/events/base-listener";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: ITicketCreatedEvent["data"], msg: Message): Promise<void> {
    const { title, price, id } = data;
    const ticket = Ticket.build({ title, price, id });
    await ticket.save();
    msg.ack();
  }
}
export default TicketCreatedListener;
