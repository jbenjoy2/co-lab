const db = require("../db");
const bcrypt = require("bcrypt");
const { updateQuery, arrangementProjectUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("test project partial update helper", () => {
  it("should take in one update field", () => {
    const update = updateQuery({ keyName: "value" }, { keyName: "key_name" });
    expect(update).toEqual({
      setTerms: `"key_name"=$1`,
      setVals: ["value"]
    });
  });
  it("should take in multiple update fields", () => {
    const update = updateQuery(
      { keyOne: "val1", keyTwo: "val2", keyThree: "val3" },
      { keyOne: "key_one", keyTwo: "key_two", keyThree: "key_three" }
    );
    expect(update).toEqual({
      setTerms: `"key_one"=$1, "key_two"=$2, "key_three"=$3`,
      setVals: ["val1", "val2", "val3"]
    });
  });
  it("should respond with empty keys for no update fields", () => {
    const update = updateQuery({});
    expect(update).toEqual({
      setTerms: "",
      setVals: []
    });
  });
});

describe("arrangementProjectUpdate", () => {
  let projId;
  BCRYPT_WORK_FACTOR = 1;

  beforeEach(async () => {
    // add a user to the database and a project to the database with that user as its owner
    //
    const hashedPW = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);
    //   users
    await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email) VALUES ('test1', $1, 'Test', 'User1', 'test1@test.com')`,
      [hashedPW]
    );
    const project = await db.query(
      `INSERT INTO projects(title, owner) VALUES('testproj', 'test1') RETURNING id, updated_at`
    );
    projId = project.rows[0].id;
    projUpdate = project.rows[0].updated_at;
  });
  it("should update a project if a valid project id is passed", async () => {
    try {
      const update = await arrangementProjectUpdate(projId);
      expect(update).toEqual(expect.objectContaining({ updated_at: expect.any(Date) }));
      expect(update.updated_at).not.toEqual(projUpdate);
    } catch (error) {
      console.log("An error has occured: ", error);
    }
  });
  it("should throw an error if invalid projectId is passed in", async () => {
    try {
      const update = await arrangementProjectUpdate(999999);
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
  it("should throw an error if nothing is passed in", async () => {
    try {
      const update = await arrangementProjectUpdate();
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
  afterEach(async () => {
    await db.query("delete from users");
  });
});

afterAll(() => {
  db.end();
});
