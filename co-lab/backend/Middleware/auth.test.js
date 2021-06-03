const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const { authenticateToken, checkLoggedIn, checkCorrectUser } = require("./auth");
const { SECRET_KEY } = require("../config");

const testToken = jwt.sign({ username: "testuser" }, SECRET_KEY);
const badToken = jwt.sign({ username: "testuser" }, "badKey");

describe("authenticateToken", () => {
  it("should work with a token in the header", () => {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${testToken}` } };
    const res = { auth: {} };
    const next = err => {
      expect(err).toBeFalsy();
    };
    authenticateToken(req, res, next);
    expect(res.auth).toEqual({
      user: {
        iat: expect.any(Number),
        username: "testuser"
      }
    });
  });
  it("should work if no header is passed (doesn't throw an error", () => {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badToken}` } };
    const res = { auth: {} };
    const next = err => {
      expect(err).toBeFalsy();
    };
    authenticateToken(req, res, next);
    expect(res.auth).toEqual({});
  });
  it("should work if a bad token is passed (doesn't throw an error)", () => {
    expect.assertions(2);
    const req = {};
    const res = { auth: {} };
    const next = err => {
      expect(err).toBeFalsy();
    };
    authenticateToken(req, res, next);
    expect(res.auth).toEqual({});
  });
});

describe("checkedLoggedIn", () => {
  it("should work properly if a user is logged in", () => {
    expect.assertions(1);
    const req = {};
    const res = { auth: { user: { username: "testuser" } } };
    const next = err => {
      expect(err).toBeFalsy();
    };
    checkLoggedIn(req, res, next);
  });
  it("should throw unauthorized if no login is passed", () => {
    expect.assertions(1);
    const req = {};
    const res = { auth: {} };
    const next = err => {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    checkLoggedIn(req, res, next);
  });
});

describe("checkCorrectUser", () => {
  it("should work if valid user is passed in", () => {
    expect.assertions(1);
    const req = { params: { username: "testuser" } };
    const res = { auth: { user: { username: "testuser" } } };
    const next = err => {
      expect(err).toBeFalsy();
    };
    checkCorrectUser(req, res, next);
  });
  it("should throw unauthorized if no user is passed in (no token)", () => {
    expect.assertions(1);
    const req = { params: { username: "testuser" } };
    const res = { auth: {} };
    const next = err => {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    checkCorrectUser(req, res, next);
  });
  it("should throw unauthorized if incorrect user is passed in(bad token)", () => {
    expect.assertions(1);
    const req = { params: { username: "testuser" } };
    const res = { auth: { user: { username: "testuser2" } } };
    const next = err => {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    checkCorrectUser(req, res, next);
  });
});
