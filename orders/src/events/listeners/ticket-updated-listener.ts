import { Message } from "node-nats-streaming";
import { ITicketUpdatedEvent, Subjects } from "@ticketing-nir/common";
import Listener from "@ticketing-nir/common/build/events/base-listener";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

class TicketUpdatedListener extends Listener<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: ITicketUpdatedEvent["data"], msg: Message): Promise<void> {
    const { title, price, id, version } = data;
    const ticket = await Ticket.findByEvent({ id, version });

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
export default TicketUpdatedListener;
