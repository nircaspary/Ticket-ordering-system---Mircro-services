import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete";
import { natsWrapper } from "../nats-wrapper";

interface IPayload {
  orderId: string;
}

const expirationQueue = new Queue<IPayload>("order:expiration", {
  redis: { host: process.env.REDIS_HOST },
});
expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({ orderId: job.data.orderId });
});

export { expirationQueue };
