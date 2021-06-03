const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

const Project = require("../models/project");

const checkProjectOwner = (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      Project.get(id)
        .then(data => {
          console.log(data);
          if (
            !(
              res.auth.user &&
              (res.auth.user.username === data.owner ||
                data.contributors.indexOf(res.auth.user.username)) !== -1
            )
          ) {
            throw new UnauthorizedError();
          }
          return next();
        })
        .catch(err => {
          return next(err);
        });
    } else {
      if (!(res.auth.user && res.auth.user.username === req.body.owner)) {
        throw new UnauthorizedError();
      }
      return next();
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = { checkProjectOwner };
