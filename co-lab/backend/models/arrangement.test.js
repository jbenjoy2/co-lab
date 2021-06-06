"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const db = require("../db.js");
const Arrangement = require("./arrangement");
const {
  beforeAllCommon,
  beforeEachCommon,
  afterAllCommon,
  afterEachCommon,
  reqIDs,
  projIDs,
  secIds,
  arrIds
} = require("./_commonTestFuncs");
const moment = require("moment");

beforeAll(beforeAllCommon);
beforeEach(beforeEachCommon);

// <-------------------- create ---------------->
describe("create", () => {
  it("should create a new blank arrangement", async () => {
    const newProj = await db.query(
      `INSERT INTO projects(title, owner) VALUES('DUMMY PROJ', $1) RETURNING id, created_at, updated_at`,
      ["u2"]
    );
    const projId = newProj.rows[0].id;
    const newArr = await Arrangement.create(projId);
    expect(newArr).toEqual({
      project_id: projId
    });

    // check the database for the new blank arrangement
    const dbCheck = await db.query(`SELECT * FROM arrangements WHERE project_id = $1`, [projId]);
    expect(dbCheck.rows.length).toEqual(1);
  });
});
// <------------------ ADD -------------->
describe("add", () => {
  it("should successfully add a new arrangement given a valid project id, section id, and position", async () => {
    const added = await Arrangement.add(projIDs[0], secIds[1], 3);
    expect(added).toEqual({
      id: expect.any(Number),
      projectId: projIDs[0],
      sectionId: secIds[1],
      index: 3,
      updatedAt: expect.any(String)
    });
  });
  it("should throw bad request error with bad project_id", async () => {
    try {
      const added = await Arrangement.add(0, secIds[1], 3);
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
  it("should throw bad request error with bad section_id", async () => {
    try {
      const added = await Arrangement.add(projIDs[0], 0, 3);
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
});

// <------------------------- UPDATE -------------->
describe("update", () => {
  it("should successfully update an existing arrangement with a new position", async () => {
    const updated = await Arrangement.update(arrIds[0], 4);
    expect(updated).toEqual({
      id: arrIds[0],
      projectId: projIDs[0],
      sectionId: secIds[0],
      index: 4,
      updatedAt: expect.any(String)
    });
  });
  it("should throw bad request error with bad arrangement id", async () => {
    try {
      const updated = await Arrangement.update(0, 4);
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
});

// <------------------------- getAllForProject -------->
describe("getAllForProject", () => {
  it("should successfully return all arrangements for a given project id", async () => {
    const projectArrangements = await Arrangement.getAllForProject(projIDs[0]);
    expect(projectArrangements).toEqual[
      ({
        id: arrIds[0],
        sectionId: secIds[0],
        sectionName: expect.any(String),
        index: 0
      },
      {
        id: arrIds[1],
        sectionId: secIds[1],
        sectionName: expect.any(String),
        index: 1
      },
      {
        id: arrIds[2],
        sectionId: secIds[2],
        sectionName: expect.any(String),
        index: 2
      })
    ];
  });
  it("should throw not found for bad projectid", async () => {
    try {
      const arrangements = await Arrangement.getAllForProject(0);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

// <------------------------- remove -------------->
describe("remove", () => {
  it("should successfully remove an arrangement given a valid id", async () => {
    await Arrangement.remove(arrIds[2]);
    // check database for that one
    const dbCheck = await db.query(`SELECT * FROM arrangements WHERE id=$1`, [arrIds[2]]);
    expect(dbCheck.rows.length).toEqual(0);
  });
  it("should throw not found error for bad id", async () => {
    try {
      await Arrangement.remove(2);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

// <--------------------- clear ------------>
describe("clear", () => {
  it("should successfully clear out existing arrangements for a project and replace with a blank one", async () => {
    await Arrangement.clear(projIDs[0]);
    // check database for current state of arrangements
    const currentArrangements = await db.query(`SELECT * FROM arrangements WHERE project_id=$1`, [
      projIDs[0]
    ]);
    // should be exactly 1 row
    const result = currentArrangements.rows;
    expect(result.length).toEqual(1);
    expect(result[0].section_id).toBe(null);
  });
  it("should throw not found error for bad project id", async () => {
    try {
      await Arrangement.clear(0);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
    // check database for current state of arrangements
  });
});

afterEach(afterEachCommon);
afterAll(afterAllCommon);
