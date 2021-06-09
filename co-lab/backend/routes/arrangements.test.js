"use strict";

const request = require("supertest");
const app = require("../app");
const Arrangement = require("../models/arrangement");

const {
  beforeAllCommon,
  beforeEachCommon,
  afterAllCommon,
  afterEachCommon,
  u1token,
  u2token,
  projIds,
  arrIds,
  secIds
} = require("./_commonTestFuncs");

beforeAll(beforeAllCommon);
beforeEach(beforeEachCommon);

// <------------------------ GET /arrangements/:projectId ----------------->
describe("GET /arrangements/:projectId", () => {
  it("should retrieve all arrangements for a given project Id with a valid contributor token and projectid", async () => {
    const response = await request(app)
      .get(`/arrangements/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      arrangement: [
        {
          id: arrIds[0],
          sectionId: null,
          sectionName: null,
          index: 0
        }
      ]
    });
  });
  it("fails with unauth if not a contributor", async () => {
    const response = await request(app)
      .get(`/arrangements/${projIds[0]}`)
      .set("authorization", `Bearer ${u2token}`);
    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth if not logged in", async () => {
    const response = await request(app).get(`/arrangements/${projIds[0]}`);
    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found invalid projectId", async () => {
    const response = await request(app)
      .get(`/arrangements/0`)
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(404);
  });
});

// <----------------------- POST /arrangements/:projectId ------------->
describe("POST /arrangements/:projectId", () => {
  it("should make a new blank arrangement for valid projectId and owner token", async () => {
    const response = await request(app)
      .post(`/arrangements/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      created: projIds[0]
    });
  });
  it("fails with unauth if not project owner", async () => {
    const response = await request(app)
      .post(`/arrangements/${projIds[0]}`)
      .set("authorization", `Bearer ${u2token}`);

    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth if not logged in", async () => {
    const response = await request(app).post(`/arrangements/${projIds[0]}`);

    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found if invalid projectId", async () => {
    const response = await request(app)
      .post(`/arrangements/0`)
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(404);
  });
});

// <---------------------------- PUT /arrangements/:projectId ---------->
describe("PUT /arrangements/:projectId", () => {
  it("should successfully add a new arrangement (section) to a project given valid data, token, and contributorId", async () => {
    const response = await request(app)
      .put(`/arrangements/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`)
      .send({
        data: [
          {
            section: secIds[0],
            position: 1
          }
        ]
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      updated: `project${projIds[0]} arrangement`
    });
  });
  it("should successfully update an existing arrangement (section) to a project given valid data, token, and contributorId", async () => {
    const response = await request(app)
      .put(`/arrangements/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`)
      .send({
        data: [{ id: arrIds[0], section: secIds[0], position: 1 }]
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      updated: `project${projIds[0]} arrangement`
    });
  });
  it("should successfully remove an existing arrangement (section) from a project given valid data, token, and contributorId", async () => {
    //   add a new arrangement to the database manually then remove it
    await Arrangement.add(projIds[0], secIds[1], 1);
    const response = await request(app)
      .put(`/arrangements/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`)
      .send({
        data: [{ id: arrIds[0], section: secIds[0], position: 1 }]
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      updated: `project${projIds[0]} arrangement`
    });
  });
  it("fails with unauth if not project contributor", async () => {
    const response = await request(app)
      .put(`/arrangements/${projIds[0]}`)
      .set("authorization", `Bearer ${u2token}`)
      .send({
        data: [
          {
            section: secIds[0],
            position: 1
          }
        ]
      });
    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth if not logged in", async () => {
    const response = await request(app)
      .put(`/arrangements/${projIds[0]}`)
      .send({
        data: [
          {
            section: secIds[0],
            position: 1
          }
        ]
      });
    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found if valid projectId", async () => {
    const response = await request(app)
      .put(`/arrangements/0`)
      .set("authorization", `Bearer ${u2token}`)
      .send({
        data: [
          {
            section: secIds[0],
            position: 1
          }
        ]
      });
    expect(response.statusCode).toEqual(404);
  });
  it("fails with bad request if invalid data", async () => {
    const response = await request(app)
      .put(`/arrangements/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`)
      .send({
        data: [
          {
            section: "should be num",
            position: 1
          }
        ]
      });
    expect(response.statusCode).toEqual(400);
  });
  it("fails with bad request if missing data", async () => {
    const response = await request(app)
      .put(`/arrangements/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`)
      .send({
        data: [
          {
            position: 1
          }
        ]
      });
    expect(response.statusCode).toEqual(400);
  });
});

// <-------------------- DELETE /arrangements/:projectId/clear ----------->
describe("DELETE /arrangements/:projectId/clear", () => {
  it("should clear out a projects arrangements and reset to starting point given valid projId and contributor token", async () => {
    // add some extras
    await Arrangement.add(projIds[0], secIds[1], 1);
    await Arrangement.add(projIds[0], secIds[2], 2);
    await Arrangement.add(projIds[0], secIds[3], 3);
    const response = await request(app)
      .delete(`/arrangements/${projIds[0]}/clear`)
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      "arrangement reset": `${projIds[0]}`
    });
    const currentState = await Arrangement.getAllForProject(projIds[0]);
    expect(currentState).toEqual([
      {
        id: expect.any(Number),
        sectionId: null,
        sectionName: null,
        index: 0
      }
    ]);
  });
  it("fails with unauth if not contributor", async () => {
    // add some extras
    await Arrangement.add(projIds[0], secIds[1], 1);
    await Arrangement.add(projIds[0], secIds[2], 2);
    await Arrangement.add(projIds[0], secIds[3], 3);
    const response = await request(app)
      .delete(`/arrangements/${projIds[0]}/clear`)
      .set("authorization", `Bearer ${u2token}`);
    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth if not logged in", async () => {
    // add some extras
    await Arrangement.add(projIds[0], secIds[1], 1);
    await Arrangement.add(projIds[0], secIds[2], 2);
    await Arrangement.add(projIds[0], secIds[3], 3);
    const response = await request(app).delete(`/arrangements/${projIds[0]}/clear`);

    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found if invalid projectId", async () => {
    const response = await request(app).delete(`/arrangements/1/clear`);

    expect(response.statusCode).toEqual(404);
  });
});

afterEach(afterEachCommon);
afterAll(afterAllCommon);
