import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("Returns 404 if the ticket is not found", async () => {
  const validId = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${validId}`).send().expect(404);
});
it("Returns the ticket if the ticket is found", async () => {
  const title = "titleTest";
  const price = 10;
  const res = await request(app).post("/api/tickets").set("Cookie", global.getAuthCookie()).send({ title, price }).expect(201);
  const ticket = await request(app).get(`/api/tickets/${res.body.id}`).send().expect(200);
  expect(ticket.body.title).toEqual(title);
  expect(ticket.body.price).toEqual(price);
});
