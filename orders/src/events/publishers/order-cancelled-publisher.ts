import Publisher from "@ticketing-nir/common/build/events/base-publisher";
import { IOrderCancelledEvent, Subjects } from "@ticketing-nir/common";

export class OrderCancelledPublisher extends Publisher<IOrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
