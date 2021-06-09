const { UnauthorizedError } = require("../expressError");

const Project = require("../models/project");

const checkProjectContributor = async (req, res, next) => {
  try {
    const id = req.params.projectId;
    const project = await Project.get(id);
    if (!res.auth.user || project.contributors.indexOf(res.auth.user.username) === -1) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

const checkProjectOwner = async (req, res, next) => {
  try {
    const id = req.params.projectId;
    const project = await Project.get(id);
    if (!(res.auth.user && res.auth.user.username === project.owner)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { checkProjectOwner, checkProjectContributor };
