import { IExpirationCompleteEvent, Subjects } from "@ticketing-nir/common";
import Publisher from "@ticketing-nir/common/build/events/base-publisher";

export class ExpirationCompletePublisher extends Publisher<IExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
