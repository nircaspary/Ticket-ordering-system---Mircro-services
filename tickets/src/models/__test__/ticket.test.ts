import { MongooseError } from "mongoose";
import { Ticket } from "../ticket";

it("Implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({ title: "concert", price: 20, userId: "123" });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 15 });

  await firstInstance?.save();

  try {
    await secondInstance?.save();
  } catch (err: any) {
    if (err.stack.startsWith("VersionError:")) {
      return;
    }
    throw new Error("Wrong error thrown");
  }
  throw new Error("No error thrown");
});

it("Increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({ title: "concert", price: 20, userId: "123" });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
