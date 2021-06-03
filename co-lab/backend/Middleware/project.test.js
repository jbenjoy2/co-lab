process.env.NODE_ENV = "test";

const db = require("../db");
const bcrypt = require("bcrypt");
const { checkProjectContributor, checkProjectOwner } = require("./project");
const { UnauthorizedError } = require("../expressError");
const BCRYPT_WORK_FACTOR = 1;

beforeAll(function() {
  let projId;
});
beforeEach(async () => {
  //   add three users to the database- one for the owner, one for contributor, one for neither, and add one project wiht an owner and a contributor in the cowrites

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
  await db.query(
    `INSERT INTO users(username, password, first_name, last_name, email) VALUES ('test3', $1,'Test', 'User3', 'test3@test.com')`,
    [hashedPW]
  );
  //   project -grab id for cowrtes
  const project = await db.query(
    `INSERT INTO projects(title, owner) VALUES('testproj', 'test1') RETURNING(id)`
  );
  projId = project.rows[0].id;
  //   cowrites
  await db.query(
    `INSERT INTO cowrites(project_id, username, is_owner) VALUES ($1, 'test1', true)`,
    [projId]
  );
  await db.query(
    `INSERT INTO cowrites(project_id, username, is_owner) VALUES ($1, 'test2', false)`,
    [projId]
  );
});

describe("checkProjectContributor", () => {
  expect.assertions(1);
  it("should work if user is project owner", async () => {
    const req = { params: { projectId: projId } };
    const res = { auth: { user: { username: "test1" } } };
    const next = err => {
      expect(err).toBeFalsy();
    };
    try {
      await checkProjectContributor(req, res, next);
    } catch (error) {
      console.log("an error occured: ", error);
    }
  });
  it("should work if user is project contributor but is not owner", async () => {
    expect.assertions(1);
    const req = { params: { projectId: projId } };
    const res = { auth: { user: { username: "test2" } } };
    const next = err => {
      expect(err).toBeFalsy();
    };
    try {
      await checkProjectContributor(req, res, next);
    } catch (error) {
      console.log("an error occured: ", error);
    }
  });
  it("should throw unauthorized if user is not on project", async () => {
    expect.assertions(1);
    const req = { params: { projectId: projId } };
    const res = { auth: { user: { username: "test3" } } };
    const next = err => {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    try {
      await checkProjectContributor(req, res, next);
    } catch (error) {
      console.error("an error occured: ", error);
    }
  });
});

describe("checkProjectOwner", () => {
  expect.assertions(1);
  it("should work (no error) if user is owner of the project", async () => {
    const req = { params: { projectId: projId } };
    const res = { auth: { user: { username: "test1" } } };
    const next = err => {
      expect(err).toBeFalsy();
    };
    try {
      await checkProjectOwner(req, res, next);
    } catch (error) {
      console.log("an error occured: ", error);
    }
  });
  it("should throw unauthorized if user is on project but not owner of the project", async () => {
    expect.assertions(1);
    const req = { params: { projectId: projId } };
    const res = { auth: { user: { username: "test2" } } };
    const next = err => {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    try {
      await checkProjectOwner(req, res, next);
    } catch (error) {
      console.log("an error occured: ", error);
    }
  });
  it("should throw unauthorized if user is not on project or does not exist", async () => {
    expect.assertions(2);
    const req = { params: { projectId: projId } };
    const res1 = { auth: { user: { username: "test3" } } };
    const res2 = { auth: { user: { username: "test4" } } };
    const next = err => {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    try {
      await checkProjectOwner(req, res1, next);
      await checkProjectOwner(req, res2, next);
    } catch (error) {
      console.log("an error occured: ", error);
    }
  });
});

afterEach(async () => {
  await db.query(`delete from users`);
});
afterAll(async () => {
  await db.end();
});
