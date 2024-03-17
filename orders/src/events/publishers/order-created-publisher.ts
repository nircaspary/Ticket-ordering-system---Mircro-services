import Publisher from "@ticketing-nir/common/build/events/base-publisher";
import { IOrderCreatedEvent, Subjects } from "@ticketing-nir/common";

export class OrderCreatedPublisher extends Publisher<IOrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
