"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const db = require("../db.js");
const User = require("./user");
const {
  beforeAllCommon,
  beforeEachCommon,
  afterAllCommon,
  afterEachCommon,
  reqIDs,
  projIDs
} = require("./_commonTestFuncs");
const { updateQuery } = require("../helperFuncs/sql");

beforeAll(beforeAllCommon);
beforeEach(beforeEachCommon);

// <-------------------authentication tests --------------------------->
describe("authenticate", () => {
  it("should authenticate a user", async () => {
    const user = await User.authenticate("u1", "testpass");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com"
    });
  });
  it("should throw unauthorized if no such user", async () => {
    try {
      await User.authenticate("noSuchUser", "noSuchPassword");
    } catch (error) {
      expect(error instanceof UnauthorizedError).toBeTruthy();
    }
  });
  it("should throw unauthorized if incorrect password", async () => {
    try {
      await User.authenticate("u1", "noSuchPassword");
    } catch (error) {
      expect(error instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

// <--------------------- registration tests ----------------------->
describe("register", () => {
  const userToAdd = {
    username: "new",
    firstName: "Test",
    lastName: "User",
    email: "test@test.com"
  };
  it("should work to register a new user", async () => {
    const user = await User.register({
      ...userToAdd,
      password: "testpass"
    });
    expect(user).toEqual(userToAdd);
    // check the database to make sure it actually went in
    const success = await db.query(`SELECT * FROM users WHERE username = 'new'`);
    expect(success.rows.length).toEqual(1);
    // check to make sure other fields were entered properly;
    expect(success.rows[0].first_name).toEqual("Test");
    // check to make sure password got hashed first
    expect(success.rows[0].password.startsWith(`$2b$`)).toEqual(true);
  });
  it("should throw bad request error with duplicate username", async () => {
    try {
      await User.register({
        ...userToAdd,
        password: "testpass"
      });
      await User.register({
        username: "new",
        firstName: "New",
        lastName: "User",
        email: "test2@test.com",
        password: "testpass"
      });
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
  it("should throw bad request error with duplicate email", async () => {
    try {
      await User.register({
        ...userToAdd,
        password: "testpass"
      });
      await User.register({
        username: "new2",
        firstName: "New",
        lastName: "User",
        email: "test@test.com",
        password: "testpass"
      });
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
});

// <----------------------Get all users- test optional search parameters--------------->
describe("findAll", () => {
  it("should return all users in the database if no search parameters are passed", async () => {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        imageURL: null
      },
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com",
        imageURL: null
      }
    ]);
  });

  it("should work when filtering by first name exact or similar ", async () => {
    const exactUsers = await User.findAll({ firstName: "U1F" });
    expect(exactUsers).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        imageURL: null
      }
    ]);
    const similarUsers = await User.findAll({ firstName: "U1" });
    expect(similarUsers).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        imageURL: null
      }
    ]);
  });
  it("should work when filtering by last name that is exact or similar ", async () => {
    const exactUsers = await User.findAll({ lastName: "U2L" });
    expect(exactUsers).toEqual([
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com",
        imageURL: null
      }
    ]);
    const similarUsers = await User.findAll({ lastName: "2L" });
    expect(similarUsers).toEqual([
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com",
        imageURL: null
      }
    ]);
  });
  it("should work when filtering by username that is exact or smilar", async () => {
    const exactUsers = await User.findAll({ username: "u1" });
    expect(exactUsers).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        imageURL: null
      }
    ]);
    const similarUsers = await User.findAll({ username: "u" });
    expect(similarUsers).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        imageURL: null
      },
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com",
        imageURL: null
      }
    ]);
  });
  it("should work when filtering by multiple parameters", async () => {
    const exactUsers = await User.findAll({ username: "u", firstName: "U1F" });
    expect(exactUsers).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        imageURL: null
      }
    ]);
    const similarUsers = await User.findAll({ username: "u", lastName: "2" });
    expect(similarUsers).toEqual([
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com",
        imageURL: null
      }
    ]);
  });
  it("should return empty list if filter returns nothing", async () => {
    let users = await User.findAll({ username: "notgonnafindme" });
    expect(users).toEqual([]);
  });
  it("should throw an error if one occurs", async () => {
    try {
      let users = await User.findAll({ job: "invalid" });
    } catch (error) {
      expect(error instanceof BadRequestError).toBeTruthy();
    }
  });
});

// <------------------------get single user details----->
describe("get", () => {
  it("should return a user if found with all of their projects listed", async () => {
    const user = await User.getUser("u1");

    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      imageURL: null,
      projects: [
        {
          id: projIDs[0],
          updatedAt: expect.any(String),
          title: expect.any(String),
          owner: expect.any(Boolean)
        }
      ]
    });
  });
  it("should show an empty array for users with no projects", async () => {
    const user = await User.getUser("u2");
    expect(user).toEqual({
      username: "u2",
      firstName: "U2F",
      lastName: "U2L",
      email: "u2@email.com",
      imageURL: null,
      projects: []
    });
  });
  it("should raise not found if no such user", async () => {
    try {
      const user = await User.getUser("notReal");
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

// <-----------------------remove------------->
describe("remove", () => {
  it("should successfully remove a given user", async () => {
    await User.remove("u1");
    // check database for removal;
    const dbCheck = await db.query("SELECT * FROM users WHERE username='u1'");
    expect(dbCheck.rows.length).toEqual(0);
  });
  it("should throw not found error if username doesn't exist", async () => {
    try {
      await User.remove("fakeuser");
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});

// <---------------------update------------>
describe("update", () => {
  it("should update a given user with new firstName", async () => {
    const updateData = {
      firstName: "New"
    };
    let user = await User.update("u1", updateData);
    expect(user).toEqual({
      username: "u1",
      lastName: expect.any(String),
      email: expect.any(String),
      ...updateData
    });
  });
  it("should update a given user with new lastName", async () => {
    const updateData = {
      lastName: "New"
    };
    let user = await User.update("u1", updateData);
    expect(user).toEqual({
      username: "u1",
      firstName: expect.any(String),
      email: expect.any(String),
      ...updateData
    });
  });
  it("should update a given user with new email", async () => {
    const updateData = {
      email: "new@test.com"
    };
    let user = await User.update("u1", updateData);
    expect(user).toEqual({
      username: "u1",
      firstName: expect.any(String),
      lastName: expect.any(String),
      ...updateData
    });
  });
  it("should update a given user with multiple parameters", async () => {
    const updateData = {
      firstName: "New",
      lastName: "Last",
      email: "new@test.com"
    };
    let user = await User.update("u1", updateData);
    expect(user).toEqual({
      username: "u1",
      ...updateData
    });
  });
  it("fails with not found if no user", async () => {
    const updateData = {
      firstName: "New",
      lastName: "Last",
      email: "new@test.com"
    };
    try {
      let user = await User.update("wrong", updateData);
    } catch (error) {
      expect(error instanceof NotFoundError).toBeTruthy();
    }
  });
});
afterEach(afterEachCommon);
afterAll(afterAllCommon);
