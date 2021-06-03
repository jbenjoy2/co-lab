const jwt = require("jsonwebtoken");
const { tokenFactory } = require("./token");
const { SECRET_KEY } = require("../config");

describe("tokenFactory", () => {
  it("should create a token if passed a user with a username property", () => {
    const user = { username: "test" };
    const token = tokenFactory(user);

    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      username: "test",
      iat: expect.any(Number)
    });
  });
  it("should create token with undefined username value if an invalid user is passed", () => {
    const user = { firstName: "eugene" };
    const token = tokenFactory(user);
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: undefined
    });
  });
  it("should throw error if nothing is passed", () => {
    try {
      const token = tokenFactory();
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
