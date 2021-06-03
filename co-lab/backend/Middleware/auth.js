// middleware to handle logged in/project ownership
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

// if token is provided properly using Bearer schema, extract it and verify it. If it verifies, store payload on res.auth.user
const authenticateToken = (req, res, next) => {
  res.auth = {};
  try {
    const header = req.headers && req.headers.authorization;
    if (header) {
      const token = header.replace(/^[Bb]earer /, "").trim();
      res.auth.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (error) {
    return next();
  }
};

// check for token status on res.auth to see if user is logged in. If not, raise Unauthorized
const checkLoggedIn = (req, res, next) => {
  try {
    if (!res.auth.user) throw new UnauthorizedError();
    return next();
  } catch (error) {
    return next(error);
  }
};

// check token status on res.auth to see user is logged in and is also the correct user. If either is false, throw unauthorized

const checkCorrectUser = (req, res, next) => {
  try {
    if (!(res.auth.user && res.auth.user.username === req.params.username)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  authenticateToken,
  checkLoggedIn,
  checkCorrectUser
};
