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
  projIds
} = require("./_commonTestFuncs");

beforeAll(beforeAllCommon);
beforeEach(beforeEachCommon);

// <------------------ DELETE /cowrites ----------->
describe("DELETE /cowrites", () => {
  it("should remove a user from a project which they contribute to with valid projectId, username, and contributor token", async () => {
    const response = await request(app)
      .delete("/cowrites")
      .send({
        projectId: projIds[0],
        username: "testuser1"
      })
      .set("authorization", `Bearer ${u1token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      removed: {
        projectId: projIds[0],
        username: "testuser1"
      }
    });
  });
  it("fails with unauth if not a project contributor", async () => {
    const response = await request(app)
      .delete("/cowrites")
      .send({
        projectId: projIds[0],
        username: "testuser2"
      })
      .set("authorization", `Bearer ${u2token}`);

    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth if no token", async () => {
    const response = await request(app)
      .delete("/cowrites")
      .send({
        projectId: projIds[0],
        username: "testuser2"
      });

    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found if nonexistent project", async () => {
    const response = await request(app)
      .delete("/cowrites")
      .send({
        projectId: 0,
        username: "testuser1"
      })
      .set("authorization", `Bearer ${u1token}`);

    expect(response.statusCode).toEqual(404);
  });
  it("fails with bad request if invalid data", async () => {
    const response = await request(app)
      .delete("/cowrites")
      .send({
        projectId: projIds[0],
        username: 95
      })
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(400);
  });
  it("fails with bad request if missing data", async () => {
    const response = await request(app)
      .delete("/cowrites")
      .send({
        projectId: projIds[0]
      })
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(400);
  });
});

afterEach(afterEachCommon);
afterAll(afterAllCommon);
