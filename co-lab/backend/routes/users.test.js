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
const { tokenFactory } = require("../helperFuncs/token");
beforeAll(beforeAllCommon);
beforeEach(beforeEachCommon);

// <------------------ GET /users ------------>
describe("GET /users", () => {
  it("should work with valid token with no filters", async () => {
    const response = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      users: [
        {
          username: "testuser1",
          firstName: "Test",
          lastName: "User1",
          email: "test1@test.com",
          imageURL: null
        },
        {
          username: "testuser2",
          firstName: "Test",
          lastName: "User2",
          email: "test2@test.com",
          imageURL: null
        },
        {
          username: "testuser3",
          firstName: "Test",
          lastName: "User3",
          email: "test3@test.com",
          imageURL: null
        }
      ]
    });
  });
  it("should work with single filter", async () => {
    const response = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1token}`)
      .query({
        firstName: "Test"
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      users: [
        {
          username: "testuser1",
          firstName: "Test",
          lastName: "User1",
          email: "test1@test.com",
          imageURL: null
        },
        {
          username: "testuser2",
          firstName: "Test",
          lastName: "User2",
          email: "test2@test.com",
          imageURL: null
        },
        {
          username: "testuser3",
          firstName: "Test",
          lastName: "User3",
          email: "test3@test.com",
          imageURL: null
        }
      ]
    });
  });
  it("should work with multiple filters", async () => {
    const response = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1token}`)
      .query({
        username: "user",
        lastName: "user2"
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      users: [
        {
          username: "testuser2",
          firstName: "Test",
          lastName: "User2",
          email: "test2@test.com",
          imageURL: null
        }
      ]
    });
  });
  it("should return a `no users found` message if none are found", async () => {
    const response = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1token}`)
      .query({
        username: "testuser4"
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual("No users found that match your search!");
  });
  it("fails with BadRequestError if query validation fails", async () => {
    const response = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1token}`)
      .query({
        email: "not_an_email"
      });
    expect(response.statusCode).toEqual(400);
  });
  it("fails with unauthorized if no token is passed", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toEqual(401);
  });
});

// <------------------------- GET /users/:username -------->
describe("GET /users/:username", () => {
  it("should work for valid logged-in user", async () => {
    const response = await request(app)
      .get("/users/testuser1")
      .set("authorization", `Bearer ${u1token}`);
    expect(response.body).toEqual({
      user: {
        username: "testuser1",
        firstName: "Test",
        lastName: "User1",
        email: "test1@test.com",
        imageURL: null,
        projects: [
          {
            id: projIds[1],
            updatedAt: expect.any(String),
            title: "testproj2",
            owner: true
          },
          {
            id: projIds[0],
            updatedAt: expect.any(String),
            title: "testproj1",
            owner: true
          }
        ]
      }
    });
  });
  it("should work for valid logged-in user-empty projects array for user with no projects", async () => {
    const response = await request(app)
      .get("/users/testuser3")
      .set("authorization", `Bearer ${u1token}`);
    expect(response.body).toEqual({
      user: {
        username: "testuser3",
        firstName: "Test",
        lastName: "User3",
        email: "test3@test.com",
        imageURL: null,
        projects: []
      }
    });
  });
  it("fails with unauthorized if no token provided ", async () => {
    const response = await request(app).get("/users/testuser3");
    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found if user cannot be found", async () => {
    const response = await request(app)
      .get("/users/nope")
      .set("authorization", `Bearer ${u1token}`);
    expect(response.statusCode).toEqual(404);
  });
});

// <------------------------ POST /users/register ---------->
describe("POST /users/register", () => {
  it("should work with correct data provided", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        username: "newuser",
        firstName: "New",
        lastName: "User4",
        password: "testpass",
        email: "test4@test.com"
      });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      token: expect.any(String)
    });
  });
  it("fails with bad request with missing fields", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        username: "newuser",
        firstName: "New",
        lastName: "User4",
        password: "testpass"
      });
    expect(response.statusCode).toEqual(400);
  });
  it("fails with bad request with invalid data", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        username: "newuser",
        firstName: "New",
        lastName: "User4",
        password: "testpass",
        email: "notAnEmail"
      });
    expect(response.statusCode).toEqual(400);
  });
});

// <------------------------ POST /users/login ---------->
describe("POST /users/login", () => {
  it("should work with valid data passed", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        username: "testuser1",
        password: "testpass1"
      });
    expect(response.body).toEqual({
      token: expect.any(String)
    });
  });
  it("fails with unauthorized if nonexistent user ", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        username: "notAUser",
        password: "testpass1"
      });
    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauthorized if incorrect password ", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        username: "testuser1",
        password: "thisissowrong"
      });
    expect(response.statusCode).toEqual(401);
  });
  it("fails with bad request error if missing data ", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        username: "testuser1"
      });
    expect(response.statusCode).toEqual(400);
  });
  it("fails with bad request error if invalid data ", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        username: "testuser1",
        password: 15
      });
    expect(response.statusCode).toEqual(400);
  });
});

// <----------------------- PATCH /users/:username ----------->
describe("PATCH /users/:username", () => {
  it("should update a project with a valid user token, username, and update data", async () => {
    const response = await request(app)
      .patch(`/users/testuser1`)
      .set("authorization", `Bearer ${u1token}`)
      .send({
        firstName: "New",
        lastName: "Newlast",
        email: "new@test.com"
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      user: {
        username: "testuser1",
        firstName: "New",
        lastName: "Newlast",
        email: "new@test.com"
      }
    });
  });
  it("fails with unauth if not correct user", async () => {
    const response = await request(app)
      .patch(`/users/testuser1`)
      .set("authorization", `Bearer ${u2token}`)
      .send({
        firstName: "New",
        lastName: "Newlast",
        email: "new@test.com"
      });
    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth if not logged in", async () => {
    const response = await request(app)
      .patch(`/users/testuser1`)
      .send({
        firstName: "New",
        lastName: "Newlast",
        email: "new@test.com"
      });
    expect(response.statusCode).toEqual(401);
  });
  it("fails with notfound if no such user", async () => {
    // make dummy token
    const dummyUser = { username: "notauser" };
    const dummyToken = tokenFactory(dummyUser);
    const response = await request(app)
      .patch(`/users/notauser`)
      .set("authorization", `Bearer ${dummyToken}`)
      .send({
        firstName: "New",
        lastName: "Newlast",
        email: "new@test.com"
      });
    expect(response.statusCode).toEqual(404);
  });
});

// <----------------------- DELETE /users/:username ------->
describe("DELETE /users/:username", () => {
  it("should work for correct user", async () => {
    const response = await request(app)
      .delete("/users/testuser1")
      .set("authorization", `Bearer ${u1token}`);
    expect(response.body).toEqual({
      deleted: "testuser1"
    });
  });
  it("fails with unauth for incorrect user", async () => {
    const response = await request(app)
      .delete("/users/testuser1")
      .set("authorization", `Bearer ${u2token}`);
    expect(response.statusCode).toEqual(401);
  });
  it("fails with unauth for anonymous", async () => {
    const response = await request(app).delete("/users/testuser1");
    expect(response.statusCode).toEqual(401);
  });
  it("fails with not found for missing user", async () => {
    // create a token for the nonexistent user so that it can pass middleware
    const dummyToken = tokenFactory({ username: "notauser" });
    const response = await request(app)
      .delete("/users/notauser")
      .set("authorization", `Bearer ${dummyToken}`);
    expect(response.statusCode).toEqual(404);
  });
});
afterEach(afterEachCommon);
afterAll(afterAllCommon);
