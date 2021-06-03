const { UnauthorizedError } = require("../expressError");

const Request = require("../models/request");

const checkRequestRecipient = (req, res, next) => {
  try {
    const { id } = req.params;
    Request.getSingleRequest(id)
      .then(data => {
        if (data.recipient !== res.auth.user.username) {
          throw new UnauthorizedError();
        }
        return next();
      })
      .catch(e => {
        return next(e);
      });
  } catch (error) {
    return next(error);
  }
};

module.exports = { checkRequestRecipient };
