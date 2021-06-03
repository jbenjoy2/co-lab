const { UnauthorizedError } = require("../expressError");

const Request = require("../models/request");

const checkRequestRecipient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await Request.getSingleRequest(id);
    if (request.recipient && request.recipient !== res.auth.user.username) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { checkRequestRecipient };
