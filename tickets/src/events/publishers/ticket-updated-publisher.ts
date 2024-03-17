import { ITicketUpdatedEvent, Subjects } from "@ticketing-nir/common";
import Publisher from "@ticketing-nir/common/build/events/base-publisher";

class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
export default TicketUpdatedPublisher;
