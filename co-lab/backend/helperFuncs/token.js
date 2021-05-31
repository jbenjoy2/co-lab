const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const tokenFactory = user => {
  let payload = {
    username: user.username
  };

  return jwt.sign(payload, SECRET_KEY);
};

module.exports = { tokenFactory };
