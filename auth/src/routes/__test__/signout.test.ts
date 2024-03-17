import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  await request(app).post("/api/users/signup").send({ email: "nircs2212@gmail.com", password: "12345678" }).expect(201);
  await request(app).post("/api/users/signin").send({ email: "nircs2212@gmail.com", password: "12345678" }).expect(200);
  const response = await request(app).get("/api/users/signout").send({}).expect(200);
  expect(response.headers["set-cookie"][0]).toMatch(new RegExp("^session=;.*"));
});
