import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", global.getAuthCookie()).send({ title: "titleTest1", price: 10 });
};

it("Can Fetch a list of tickets", async () => {
  await createTicket().expect(201);
  await createTicket().expect(201);
  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(2);
});
