const request = require("supertest");

const app = require("./app");
const db = require("./db");

it("should throw 404 for bad route", async function() {
  const response = await request(app).get("/no-such-path");
  expect(response.statusCode).toEqual(404);
});

it("should throaw 404 for bad route, (test stack print)", async function() {
  process.env.NODE_ENV = "";
  const response = await request(app).get("/no-such-path");
  expect(response.statusCode).toEqual(404);
  delete process.env.NODE_ENV;
});

afterAll(function() {
  db.end();
});
