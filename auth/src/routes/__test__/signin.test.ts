import request from "supertest";
import { app } from "../../app";

it("fails when a email that does not exist is supplied", async () => {
  await request(app).post("/api/users/signin").send({ email: "tefst@tesst.coms", password: "12345678" }).expect(400);
});
it("fails when an incorrect password is supplied", async () => {
  await request(app).post("/api/users/signup").send({ email: "nircs2212@gmail.com", password: "12345678" }).expect(201);
  await request(app).post("/api/users/signin").send({ email: "nircs2212@gmail.com", password: "0000" }).expect(400);
});
it("responds with a coockie when given valid credentials", async () => {
  await request(app).post("/api/users/signup").send({ email: "nircs2212@gmail.com", password: "12345678" }).expect(201);
  const response = await request(app).post("/api/users/signin").send({ email: "nircs2212@gmail.com", password: "12345678" }).expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
