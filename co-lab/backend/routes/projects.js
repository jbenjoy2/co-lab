const express = require("express");
const { BadRequestError } = require("../expressError");

const Project = require("../models/project");
const jsonschema = require("jsonschema");
const projectNewSchema = require("../schemas/projectNewSchema.json");
const projectUpdateSchema = require("../schemas/projectUpdateSchema.json");
const router = new express.Router();
const { checkCorrectUser, checkLoggedIn } = require("../Middleware/auth");
const { checkProjectOwner, checkProjectContributor } = require("../Middleware/project");

router.post("/new", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, projectNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { title, owner } = req.body;
    const newProject = await Project.create(title, owner);
    return res.status(201).json({ newProject });
  } catch (error) {
    return next(error);
  }
});

router.get("/:projectId", checkProjectContributor, async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const project = await Project.get(projectId);
    return res.json({ project });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:projectId", checkProjectContributor, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, projectUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const proj = await Project.update(req.params.id, req.body);
    return res.json({ updated: proj });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:projectId", checkProjectOwner, async (req, res, next) => {
  try {
    await Project.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
