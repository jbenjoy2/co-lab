const { UnauthorizedError } = require("../expressError");

const Project = require("../models/project");

const checkProjectContributor = (req, res, next) => {
  try {
    const { id } = req.params;
    Project.get(id)
      .then(data => {
        if (data.contributors.indexOf(res.auth.user.username) === -1) {
          throw new UnauthorizedError();
        }
        return next();
      })
      .catch(err => {
        return next(err);
      });
  } catch (error) {
    return next(error);
  }
};

const checkProjectOwner = (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      Project.get(id)
        .then(data => {
          if (!(res.auth.user && res.auth.user.username === data.owner)) {
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

module.exports = { checkProjectOwner, checkProjectContributor };
