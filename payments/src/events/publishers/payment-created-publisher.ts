import { IPaymentCreatedEvent, Subjects } from "@ticketing-nir/common";
import Publisher from "@ticketing-nir/common/build/events/base-publisher";

export class PaymentCreatedPublisher extends Publisher<IPaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
