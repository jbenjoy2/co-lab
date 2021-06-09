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
  reqIds
} = require("./_commonTestFuncs");

beforeAll(beforeAllCommon);
beforeEach(beforeEachCommon);
const { tokenFactory } = require("../helperFuncs/token");
const db = require("../db");
const Request = require("../models/request");
// <------------------ POST /projects/new------------>
describe("POST /projects/new", () => {
  it("should create a new project given valid data", async () => {
    const response = await request(app)
      .post("/projects/new")
      .send({
        title: "newTestProj",
        owner: "testuser3"
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      newProject: {
        id: projIds[projIds.length - 1] + 1,
        title: "newTestProj",
        owner: "testuser3",
        createdAt: expect.any(String)
      }
    });
  });
  it("fails with bad request with invalid data", async () => {
    const response = await request(app)
      .post("/projects/new")
      .send({
        title: 1,
        owner: "thatsastring"
      });

    expect(response.statusCode).toEqual(400);
  });
  it("fails with bad request with missing data", async () => {
    const response = await request(app)
      .post("/projects/new")
      .send({
        owner: "thatsastring"
      });

    expect(response.statusCode).toEqual(400);
  });
});

// <---------------------- GET /projects/:projectId -------->
describe("GET /projects/:projectId", () => {
  it("should retrieve a project id with a valid owner token and valid project id", async () => {
    const response = await request(app)
      .get(`/projects/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      project: {
        updatedAt: expect.any(String),
        title: "testproj1",
        notes: null,
        owner: "testuser1",
        contributors: ["testuser1"]
      }
    });
  });
  it("should retrieve a project id with a valid contributor token and valid project id", async () => {
    // respond to request in database to put user2 on the contributors
    Request.accept(reqIds[0]);

    const response = await request(app)
      .get(`/projects/${projIds[0]}`)
      .set("authorization", `Bearer ${u2token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      project: {
        updatedAt: expect.any(String),
        title: "testproj1",
        notes: null,
        owner: "testuser1",
        contributors: ["testuser1", "testuser2"]
      }
    });
  });
  it("fails with unauthorized if not owner or contributor", async () => {
    // respond to request in database to put user2 on the contributors

    const response = await request(app)
      .get(`/projects/${projIds[0]}`)
      .set("authorization", `Bearer ${u2token}`);

    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauthorized if anon", async () => {
    // respond to request in database to put user2 on the contributors

    const response = await request(app).get(`/projects/${projIds[0]}`);

    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found if invalid projectid", async () => {
    const response = await request(app)
      .get(`/projects/0`)
      .set("authorization", `Bearer ${u1token}`);

    expect(response.statusCode).toEqual(404);
  });
});

// ----------------------- PATCH /projects/:projectId ------>
describe("PATCH /projects/:projectId", () => {
  it("should update a project with a valid owner token, projectId, and update data", async () => {
    const response = await request(app)
      .patch(`/projects/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`)
      .send({
        title: "updatedProj",
        notes: "this is now updated"
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      updated: {
        id: projIds[0],
        updatedAt: expect.any(String),
        title: "updatedProj",
        notes: "this is now updated"
      }
    });
  });
  it("should update a project with a valid contributor token, projectId, and update data", async () => {
    // respond to request in database to put user2 on the contributors
    Request.accept(reqIds[0]);
    const response = await request(app)
      .patch(`/projects/${projIds[0]}`)
      .set("authorization", `Bearer ${u2token}`)
      .send({
        title: "updatedProj",
        notes: "this is now updated"
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      updated: {
        id: projIds[0],
        updatedAt: expect.any(String),
        title: "updatedProj",
        notes: "this is now updated"
      }
    });
  });
  it("should update a project with a valid token, projectId, and no data (only updated at is changed)", async () => {
    const response = await request(app)
      .patch(`/projects/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      updated: {
        id: projIds[0],
        updatedAt: expect.any(String),
        title: "testproj1",
        notes: null
      }
    });
  });
  it("fails with unauth error if not owner or contributor", async () => {
    const response = await request(app)
      .patch(`/projects/${projIds[0]}`)
      .set("authorization", `Bearer ${u2token}`);

    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth error if not logged in", async () => {
    const response = await request(app).patch(`/projects/${projIds[0]}`);

    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found error if bad project id", async () => {
    const response = await request(app)
      .patch(`/projects/0`)
      .set("authorization", `Bearer ${u1token}`);

    expect(response.statusCode).toEqual(404);
  });
  it("fails with bad request error if invalid data", async () => {
    const response = await request(app)
      .patch(`/projects/${projIds[0]}`)
      .set("authorization", `Bearer ${u1token}`)
      .send({
        title: "notes should be str",
        notes: 5
      });

    expect(response.statusCode).toEqual(400);
  });
});

// <------------------------- DELETE /projects/:projectId ------->
describe("DELETE /projects/:projectId", () => {
  it("should successfully delete a project given a valid owner token and valid projectId", async () => {
    const response = await request(app)
      .delete(`/projects/${projIds[2]}`)
      .set("authorization", `Bearer ${u2token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      deleted: `${projIds[2]}`
    });
  });
  it("should fail with unauth if not owner", async () => {
    const response = await request(app)
      .delete(`/projects/${projIds[2]}`)
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(401);
  });
  it("should fail with unauth if not logged in", async () => {
    const response = await request(app).delete(`/projects/${projIds[2]}`);
    expect(response.statusCode).toEqual(401);
  });
  it("should fail with not found error if bad project id", async () => {
    const response = await request(app)
      .delete(`/projects/0`)
      .set("authorization", `Bearer ${u2token}`);
    expect(response.statusCode).toEqual(404);
  });
});

afterEach(afterEachCommon);
afterAll(afterAllCommon);
