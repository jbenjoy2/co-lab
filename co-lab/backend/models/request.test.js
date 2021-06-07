"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const db = require("../db.js");
const Request = require("./request");
const {
  beforeAllCommon,
  beforeEachCommon,
  afterAllCommon,
  afterEachCommon,
  reqIDs,
  projIDs
} = require("./_commonTestFuncs");

beforeAll(beforeAllCommon);
beforeEach(beforeEachCommon);

// <--------------------------getRequestsForUser------->
describe("getRequestsForUser", () => {
  it("should fetch requests for recipient with valid username passed", async () => {
    const requests = await Request.getRequestsForUser("u2");
    expect(requests).toEqual([
      {
        requestID: reqIDs[0],
        sender: "u1",
        sentAt: expect.any(String)
      }
    ]);
  });
  it("should return an empty array for valid user with no requests sent", async () => {
    const requests = await Request.getRequestsForUser("u1");
    expect(requests).toEqual([]);
  });
  it("should throw not found for invalid username", async () => {
    try {
      const requests = await Request.getRequestsForUser("wrongUser");
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

// <----------------------- Get Single Request ---------->
describe("getSingleRequest", () => {
  it("should fetch a single request given a valid id", async () => {
    const req = await Request.getSingleRequest(reqIDs[0]);
    expect(req).toEqual({
      projectId: projIDs[0],
      recipient: "u2"
    });
  });
  it("should throw not found error with bad id", async () => {
    try {
      const req = await Request.getSingleRequest(reqIDs[0]);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

// <--------------------MAKE REQUEST ------------->
describe("makeRequest", () => {
  it("should successfully make a new request between a sender and a recipient", async () => {
    // create a new dummy user to receive the request;
    await db.query(
      `INSERT INTO users(username, password, first_name, last_name, email) VALUES('u3', 'password', 'Dummy', 'User', 'dummy@test.com')`
    );
    // make new request;
    const request = await Request.makeRequest(projIDs[0], "u1", "u3");
    expect(request).toEqual({
      id: expect.any(Number),
      sender: "u1",
      recipient: "u3",
      accepted: null,
      sentAt: expect.any(String)
    });
    // check the database to make sure its in there
    const dbCheck = await db.query(
      `SELECT id FROM requests WHERE project_id=$1 AND sender=$2 AND recipient=$3`,
      [projIDs[0], "u1", "u3"]
    );
    expect(dbCheck.rows.length).toEqual(1);
  });
  it("should throw bad request error if request already exists", async () => {
    try {
      await Request.makeRequest(projIDs[0], "u1", "u2");
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
});

// <------------------------- Accept ------------------>
describe("accept", () => {
  it("should work to accept a pending request", async () => {
    const request = await Request.accept(reqIDs[0]);
    expect(request).toEqual({
      id: reqIDs[0],
      project_id: projIDs[0],
      sender: "u1",
      recipient: "u2",
      accepted: true
    });
    // check database was actually changed
    const dbUpdateCheck = await db.query(`SELECT * FROM requests WHERE id=$1 AND accepted=true`, [
      reqIDs[0]
    ]);
    expect(dbUpdateCheck.rows.length).toEqual(1);
    // check to make sure cowrite was added in
    const cowriteCheck = await db.query(
      `SELECT * FROM cowrites WHERE project_id=$1 AND username=$2 AND is_owner=false`,
      [projIDs[0], "u2"]
    );
    expect(cowriteCheck.rows.length).toEqual(1);
  });
  it("should throw bad request error if request has already been accepted", async () => {
    //   add a new user and a request to the database that's marked as accepted
    await db.query(
      `INSERT INTO users(username, password, first_name, last_name, email) VALUES('u3', 'password', 'Dummy', 'User', 'dummy@test.com')`
    );
    const newReq = await db.query(
      `INSERT INTO requests(project_id, sender, recipient, accepted) VALUES($1, $2, $3, true) RETURNING id`,
      [projIDs[0], "u1", "u3"]
    );
    const newId = newReq.rows[0].id;
    try {
      const request = await Request.accept(newId);
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
  it("should throw bad request error if request has already been rejected", async () => {
    //   add a new user and a request to the database that's marked false for accepted
    await db.query(
      `INSERT INTO users(username, password, first_name, last_name, email) VALUES('u3', 'password', 'Dummy', 'User', 'dummy@test.com')`
    );
    const newReq = await db.query(
      `INSERT INTO requests(project_id, sender, recipient, accepted) VALUES($1, $2, $3, false) RETURNING id`,
      [projIDs[0], "u1", "u3"]
    );
    const newId = newReq.rows[0].id;
    try {
      const request = await Request.accept(newId);
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
  it("should throw not found error with bad id", async () => {
    try {
      const request = await Request.accept(0);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

// <--------------------- Reject ------------->
describe("Reject", () => {
  it("should work to reject a pending request", async () => {
    const request = await Request.reject(reqIDs[0]);
    expect(request).toEqual({
      project_id: projIDs[0],
      sender: "u1",
      recipient: "u2",
      accepted: false
    });
    // check database was actually changed
    const dbUpdateCheck = await db.query(`SELECT * FROM requests WHERE id=$1 AND accepted=false`, [
      reqIDs[0]
    ]);
    expect(dbUpdateCheck.rows.length).toEqual(1);
  });
  it("should throw bad request error if request has already been accepted", async () => {
    //   add a new user and a request to the database that's marked as accepted
    await db.query(
      `INSERT INTO users(username, password, first_name, last_name, email) VALUES('u3', 'password', 'Dummy', 'User', 'dummy@test.com')`
    );
    const newReq = await db.query(
      `INSERT INTO requests(project_id, sender, recipient, accepted) VALUES($1, $2, $3, true) RETURNING id`,
      [projIDs[0], "u1", "u3"]
    );
    const newId = newReq.rows[0].id;
    try {
      const request = await Request.reject(newId);
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
  it("should throw bad request error if request has already been rejected", async () => {
    //   add a new user and a request to the database that's marked false for accepted
    await db.query(
      `INSERT INTO users(username, password, first_name, last_name, email) VALUES('u3', 'password', 'Dummy', 'User', 'dummy@test.com')`
    );
    const newReq = await db.query(
      `INSERT INTO requests(project_id, sender, recipient, accepted) VALUES($1, $2, $3, false) RETURNING id`,
      [projIDs[0], "u1", "u3"]
    );
    const newId = newReq.rows[0].id;
    try {
      const request = await Request.reject(newId);
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
  it("should throw not found error with bad id", async () => {
    try {
      const request = await Request.reject(0);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

afterEach(afterEachCommon);
afterAll(afterAllCommon);
