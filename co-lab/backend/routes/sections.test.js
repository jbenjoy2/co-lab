"use strict";

const request = require("supertest");
const app = require("../app");

const {
  beforeAllCommon,
  beforeEachCommon,
  afterAllCommon,
  afterEachCommon,
  u1token,
  u2token,
  projIds,
  reqIds,
  secIds
} = require("./_commonTestFuncs");

beforeAll(beforeAllCommon);
beforeEach(beforeEachCommon);
const { tokenFactory } = require("../helperFuncs/token");
// <------------------ GET /sections----------->
describe("GET /sections", () => {
  it("should retrieve all sections in the database", async () => {
    const response = await request(app).get("/sections");
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      sections: [
        {
          id: secIds[0],
          name: "intro"
        },
        {
          id: secIds[1],
          name: "verse"
        },
        {
          id: secIds[2],
          name: "chorus"
        }
      ]
    });
  });
});

// <------------------------ GET /sections/:id ---------------->
describe("GET /sections/:id", () => {
  it("should retrieve a single section given a valid section Id", async () => {
    const response = await request(app).get(`/sections/${secIds[0]}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      section: {
        id: secIds[0],
        name: "intro"
      }
    });
  });
  it("fails with not found with bad section id", async () => {
    const response = await request(app).get(`/sections/0`);
    expect(response.statusCode).toEqual(404);
  });
});
afterEach(afterEachCommon);
afterAll(afterAllCommon);
