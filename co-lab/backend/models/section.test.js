"use strict";

const { NotFoundError } = require("../expressError");

const Section = require("./section");
const {
  beforeAllCommon,
  beforeEachCommon,
  afterAllCommon,
  afterEachCommon,
  secIds
} = require("./_commonTestFuncs");

beforeAll(beforeAllCommon);
beforeEach(beforeEachCommon);

// <----------------------- getAll() --------------->
describe("get all", () => {
  it("should retrieve all sections", async () => {
    const sections = await Section.getAll();
    expect(sections).toEqual([
      {
        id: expect.any(Number),
        name: "intro"
      },
      {
        id: expect.any(Number),
        name: "verse"
      },
      {
        id: expect.any(Number),
        name: "chorus"
      }
    ]);
  });
});

// <------------------------- get ------------------->
describe("get", () => {
  it("should successfully retrieve a valid section given an id", async () => {
    const section = await Section.get(secIds[0]);
    expect(section).toEqual({
      id: secIds[0],
      name: expect.any(String)
    });
  });
  it("should throw not found given an invalid id", async () => {
    try {
      const section = await Section.get(0);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

afterEach(afterEachCommon);
afterAll(afterAllCommon);
