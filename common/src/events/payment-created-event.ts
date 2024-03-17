import { Subjects } from "./subjects";

export interface IPaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    chargeId: string;
    orderId: string;
  };
}
