export enum OrderStatus {
  // When order created but the ticket it is trying to order has not been reserved
  Created = "created",
  // The ticked the order is trying to reserve has already been reseved,
  // Or the user has cancelled the order
  // Or the order expired before payment
  Cancelled = "cancelled",
  // The oreder has successfUlly reserved the ticket
  AwaitingPayment = "awaiting:payment",
  // The oreder has successfilly reserved the ticket and the user successfully provided a payment
  Complete = "complete",
}
