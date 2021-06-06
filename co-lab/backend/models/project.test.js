"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const db = require("../db.js");
const Project = require("./project");
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

// <---------------------create new project--------->
describe("create", () => {
  const newProj = {
    title: "new Test Proj",
    owner: "u1"
  };
  it("should successfully create a new project", async () => {
    const proj = await Project.create(newProj);
    expect(proj).toEqual({ ...newProj, id: expect.any(Number), createdAt: expect.any(String) });

    // check database
    const dbCheck = await db.query(`Select * from projects WHERE title='new Test Proj'`);
    expect(dbCheck.rows.length).toEqual(1);
    expect(dbCheck.rows[0].owner).toEqual("u1");
    expect(dbCheck.rows[0].created_at).toEqual(expect.any(Date));
  });
  it("should successfully create a new cowrite and arrangement on project creation", async () => {
    const proj = await Project.create(newProj);

    // check database for cowrite
    const dbCheckCowrite = await db.query(`Select * from cowrites WHERE project_id=${proj.id}`);
    expect(dbCheckCowrite.rows.length).toEqual(1);
    expect(dbCheckCowrite.rows[0].username).toEqual("u1");
    expect(dbCheckCowrite.rows[0].is_owner).toEqual(expect.any(Boolean));

    // check database for blank arrangement
    const dbCheckArrangement = await db.query(
      `SELECT * FROM arrangements WHERE project_id=${proj.id}`
    );
    expect(dbCheckArrangement.rows.length).toEqual(1);
    expect(dbCheckArrangement.rows[0].updated_at).toEqual(expect.any(Date));
    expect(dbCheckArrangement.rows[0].position).toEqual(0);
  });
});

// <---------------------- get -------------------->
describe("get", () => {
  it("should successfully return a project with its contributors listed as an array of usernames", async () => {
    const proj = await Project.get(projIDs[0]);
    expect(proj).toEqual({
      updatedAt: expect.any(String),
      title: "testproj",
      notes: null,
      owner: "u1",
      contributors: ["u1"]
    });
  });
  it("should throw not found error if project is not found", async () => {
    try {
      const proj = await Project.get(999999);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

// <----------------------- update ----------->
describe("update", () => {
  it("should update a project given updated title", async () => {
    const updateData = {
      title: "updated proj"
    };
    const proj = await Project.update(projIDs[0], updateData);
    expect(proj).toEqual({
      id: projIDs[0],
      updatedAt: expect.any(String),
      notes: null,
      ...updateData
    });
  });
  it("should update a project given updated notes", async () => {
    const updateData = {
      notes: "updated proj notes"
    };
    const proj = await Project.update(projIDs[0], updateData);
    expect(proj).toEqual({
      id: projIDs[0],
      updatedAt: expect.any(String),
      title: "testproj",
      ...updateData
    });
  });
  it("should update a project's updated time given no changes", async () => {
    const updateData = {};
    const proj = await Project.update(projIDs[0], updateData);
    expect(proj).toEqual({
      id: projIDs[0],
      updatedAt: expect.any(String),
      title: "testproj",
      notes: null
    });
  });
  it("should throw not found if project is not found", async () => {
    const updateData = {};
    try {
      await Project.update(9999999, updateData);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

// <---------------------- leave ---------->
describe("leave", () => {
  it("should work with a valid project id and username", async () => {
    // username is owner so should also delete project;
    await Project.leave(projIDs[0], "u1");
    // check cowrites;
    const cowriteCheck = await db.query(
      `SELECT id FROM cowrites WHERE project_id = $1 AND username=$2`,
      [projIDs[0], "u1"]
    );
    expect(cowriteCheck.rows.length).toEqual(0);
    // check that project was also deleted due to the fact that 'u1' is the owner
    const projCheck = await db.query(`SELECT id FROM projects WHERE id=$1`, [projIDs[0]]);
    expect(projCheck.rows.length).toEqual(0);
  });
  it("should should not delete project if user is not owner", async () => {
    // username is owner so should also delete project;
    // add another user to the project;
    const res = await db.query(
      `INSERT INTO cowrites(project_id, username, is_owner) VALUES($1, $2, false)`,
      [projIDs[0], "u2"]
    );
    await Project.leave(projIDs[0], "u2");
    // check cowrites;
    const cowriteCheck = await db.query(
      `SELECT id FROM cowrites WHERE project_id = $1 AND username=$2`,
      [projIDs[0], "u2"]
    );
    expect(cowriteCheck.rows.length).toEqual(0);
    // check that project was not deleted due to the fact that 'u2' is not the owner
    const projCheck = await db.query(`SELECT id FROM projects WHERE id=$1`, [projIDs[0]]);
    expect(projCheck.rows.length).toEqual(1);
  });
  it("should throw a bad request error with bad project id", async () => {
    try {
      await Project.leave(0, "u1");
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
  it("should throw a bad request error with bad username", async () => {
    try {
      await Project.leave(projIDs[0], "notAUser");
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
});

// <------------------------- remove ------------>
describe("remove", () => {
  it("should successfully remove a project from the database with a valid project Id", async () => {
    await Project.remove(projIDs[0]);
    // check db for removed project
    const dbCheck = await db.query(`SELECT * FROM projects WHERE id=$1`, [projIDs[0]]);
    expect(dbCheck.rows.length).toEqual(0);
  });
  it("should throw not found with invalid project Id", async () => {
    try {
      await Project.remove(0);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

afterEach(afterEachCommon);
afterAll(afterAllCommon);
