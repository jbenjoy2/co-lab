const express = require("express");
const { BadRequestError } = require("../expressError");

const Project = require("../models/project");
const jsonschema = require("jsonschema");
const cowriteLeaveSchema = require("../schemas/cowriteLeaveSchema.json");
const { checkProjectContributor } = require("../Middleware/project");
const router = new express.Router();

/**
 * DELETE / {projectId, username} => {removed: {username, projectId}}
 *
 * Authorization required: project contributor
 */
router.delete("/", checkProjectContributor, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, cowriteLeaveSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { projectId, username } = req.body;
    const leave = await Project.leave(projectId, username);
    return res.json({ removed: { username: req.body.username, projectId: req.body.projectId } });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
