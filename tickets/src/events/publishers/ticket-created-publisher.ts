import { ITicketCreatedEvent, Subjects } from "@ticketing-nir/common";
import Publisher from "@ticketing-nir/common/build/events/base-publisher";

class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
export default TicketCreatedPublisher;
