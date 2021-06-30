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
// <------------------ GET /requests/:username------------>
describe("GET /requests/:username", () => {
  it("should get all requests a user has if correct user token is provided", async () => {
    const response = await request(app)
      .get("/requests/testuser2")
      .set("authorization", `Bearer ${u2token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      userRequests: [
        {
          accepted: null,
          projectId: projIds[0],
          requestID: reqIds[0],
          sender: "testuser1",
          sentAt: expect.any(String)
        }
      ]
    });
  });
  it("should return 'no requests' mesasage if user has no requests", async () => {
    const response = await request(app)
      .get("/requests/testuser1")
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual("No requests!");
  });
  it("fails with unauth if incorrect user", async () => {
    const response = await request(app)
      .get("/requests/testuser1")
      .set("authorization", `Bearer ${u2token}`);
    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth if anonymous user", async () => {
    const response = await request(app).get("/requests/testuser1");
    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found if user doesnt exist", async () => {
    // create a token for the nonexistent user so that it can pass middleware
    const dummyToken = tokenFactory({ username: "notauser" });
    const response = await request(app)
      .get("/requests/notauser")
      .set("authorization", `Bearer ${dummyToken}`);
    expect(response.statusCode).toEqual(404);
  });
});

//  <------------------------ POST /:username/new --------->
describe("POST /requests/:username/new", () => {
  it("should work to create a new request with valid token passed for sender and valid data", async () => {
    const response = await request(app)
      .post("/requests/testuser1/new")
      .set("authorization", `Bearer ${u1token}`)
      .send({
        project_id: projIds[0],
        recipient: "testuser3"
      });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      newRequest: {
        id: expect.any(Number),
        sender: "testuser1",
        recipient: "testuser3",
        accepted: null,
        sentAt: expect.any(String)
      }
    });
  });
  it("fails with unauth if incorrect sender token", async () => {
    const response = await request(app)
      .post("/requests/testuser1/new")
      .set("authorization", `Bearer ${u2token}`)
      .send({
        project_id: projIds[0],
        recipient: "testuser3"
      });
    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth if no token", async () => {
    const response = await request(app)
      .post("/requests/testuser1/new")
      .send({
        project_id: projIds[0],
        recipient: "testuser3"
      });
    expect(response.statusCode).toEqual(401);
  });
  it("fails with bad request if already pending", async () => {
    const response = await request(app)
      .post("/requests/testuser1/new")
      .send({
        project_id: projIds[0],
        recipient: "testuser2"
      })
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(400);
  });
  it("fails with bad request if invalid data", async () => {
    const response = await request(app)
      .post("/requests/testuser1/new")
      .send({
        project_id: projIds[0],
        recipient: 2
      })
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(400);
  });
  it("fails with bad request if missing data", async () => {
    const response = await request(app)
      .post("/requests/testuser1/new")
      .send({
        project_id: projIds[0]
      })
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(400);
  });
  it("fails with not found if project id doesnt exist", async () => {
    const response = await request(app)
      .post("/requests/testuser1/new")
      .send({
        project_id: 1,
        recipient: "testuser3"
      })
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(404);
  });
  it("fails with not found if recipient doesnt exist", async () => {
    const response = await request(app)
      .post("/requests/testuser1/new")
      .send({
        project_id: projIds[0],
        recipient: "nosuchuser"
      })
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(404);
  });
  it("fails with not found if sender doesnt exist", async () => {
    const dummyToken = tokenFactory({ username: "notauser" });
    const response = await request(app)
      .post("/requests/notauser/new")
      .send({
        project_id: projIds[1],
        recipient: "testuser"
      })
      .set("authorization", `Bearer ${dummyToken}`);
    expect(response.statusCode).toEqual(404);
  });
});

// <---------------------- PUT /requests/:id ------>
describe("PUT /requests/:id", () => {
  it("should be able to accept a request with valid data and valid recipient token", async () => {
    const response = await request(app)
      .put(`/requests/${reqIds[0]}`)
      .set("authorization", `Bearer ${u2token}`)
      .send({
        response: "accept"
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      accepted: {
        id: reqIds[0],
        project_id: projIds[0],
        sender: "testuser1",
        recipient: "testuser2",
        accepted: true
      }
    });
  });
  it("should be able to reject a request with valid data and valid recipient token", async () => {
    const response = await request(app)
      .put(`/requests/${reqIds[0]}`)
      .set("authorization", `Bearer ${u2token}`)
      .send({
        response: "reject"
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      rejected: {
        id: reqIds[0],
        project_id: projIds[0],
        sender: "testuser1",
        recipient: "testuser2",
        accepted: false
      }
    });
  });
  it("fails with unauth if not recipient", async () => {
    const response = await request(app)
      .put(`/requests/${reqIds[0]}`)
      .set("authorization", `Bearer ${u1token}`)
      .send({
        response: "reject"
      });
    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth if no token", async () => {
    const response = await request(app)
      .put(`/requests/${reqIds[0]}`)
      .send({
        response: "reject"
      });

    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found if request id not found", async () => {
    const response = await request(app)
      .put(`/requests/0`)
      .set("authorization", `Bearer ${u2token}`)
      .send({
        response: "reject"
      });
    expect(response.statusCode).toEqual(404);
  });
  it("fails with bad request if invalid data", async () => {
    const response = await request(app)
      .put(`/requests/${reqIds[0]}`)
      .set("authorization", `Bearer ${u2token}`)
      .send({
        response: "rejected"
      });
    expect(response.statusCode).toEqual(400);
  });
  it("fails with bad request if missing data", async () => {
    const response = await request(app)
      .put(`/requests/${reqIds[0]}`)
      .set("authorization", `Bearer ${u2token}`);

    expect(response.statusCode).toEqual(400);
  });
  it("fails with bad request if response is some other 6-charcter string besides accept or reject", async () => {
    const response = await request(app)
      .put(`/requests/${reqIds[0]}`)
      .set("authorization", `Bearer ${u2token}`)
      .send({
        response: "i want"
      });
    expect(response.statusCode).toEqual(400);
  });
});
afterEach(afterEachCommon);
afterAll(afterAllCommon);
