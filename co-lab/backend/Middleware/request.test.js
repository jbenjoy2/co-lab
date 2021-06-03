process.env.NODE_ENV = "test";

const db = require("../db");
const bcrypt = require("bcrypt");
const { checkRequestRecipient } = require("./request");
const { UnauthorizedError, NotFoundError } = require("../expressError");
const BCRYPT_WORK_FACTOR = 1;
// global variables to change on each request
let projId;
let reqId;

beforeEach(async () => {
  //   add two users to the database- one for the sender, one for receiver, add one project wiht an owner, and add a request
  const hashedPW = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);
  //   users
  await db.query(
    `INSERT INTO users (username, password, first_name, last_name, email) VALUES ('test1', $1, 'Test', 'User1', 'test1@test.com')`,
    [hashedPW]
  );
  await db.query(
    `INSERT INTO users(username, password, first_name, last_name, email) VALUES ('test2', $1,'Test', 'User2', 'test2@test.com')`,
    [hashedPW]
  );
  //   project -grab id for requests
  const project = await db.query(
    `INSERT INTO projects(title, owner) VALUES('testproj', 'test1') RETURNING(id)`
  );
  projId = project.rows[0].id;

  //   request
  const request = await db.query(
    `INSERT INTO requests(project_id, sender, recipient) VALUES ($1, 'test1', 'test2') RETURNING id`,
    [projId]
  );
  reqId = request.rows[0].id;
});

describe("checkRequestRecipient", () => {
  it("should work (no error thrown) if the user is the recipient of the given request", async () => {
    const req = { params: { id: reqId } };
    const res = { auth: { user: { username: "test2" } } };
    const next = err => {
      expect(err).toBeFalsy();
    };
    try {
      await checkRequestRecipient(req, res, next);
    } catch (error) {
      console.log(`An error occured: ${error}`);
    }
  });
  it("should raise unauthorized if the user is not the recipient of the given request, even if they are the sender", async () => {
    const req = { params: { id: reqId } };
    const res = { auth: { user: { username: "test1" } } };
    const next = err => {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    try {
      await checkRequestRecipient(req, res, next);
    } catch (error) {
      console.log(`An error occured: ${error}`);
    }
  });
});

afterEach(async () => {
  await db.query(`delete from users`);
});
afterAll(async () => {
  await db.end();
});
