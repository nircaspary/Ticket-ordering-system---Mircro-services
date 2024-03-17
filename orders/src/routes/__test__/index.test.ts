import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => await Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: "concert", price: 20 }).save();

it("Fetches orders for an particular user", async () => {
  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOneCookie = global.getAuthCookie();
  const userTwoCookie = global.getAuthCookie();

  // Create one order as user #1
  await request(app).post("/api/orders").set("Cookie", userOneCookie).send({ ticketId: ticketOne.id }).expect(201);
  // Create two orders as user #2
  const { body: orderOne } = await request(app).post("/api/orders").set("Cookie", userTwoCookie).send({ ticketId: ticketTwo.id }).expect(201);
  const { body: orderTwo } = await request(app).post("/api/orders").set("Cookie", userTwoCookie).send({ ticketId: ticketThree.id }).expect(201);
  // Make a request for user #2 orders
  const response = await request(app).get("/api/orders").set("Cookie", userTwoCookie).expect(200);

  // Make sure we only get the orders for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
