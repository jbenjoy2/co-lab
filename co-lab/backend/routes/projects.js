const express = require("express");
const { BadRequestError } = require("../expressError");

const Project = require("../models/project");

const router = new express.Router();

module.exports = router;

router.post("/new", async (req, res, next) => {
  const { title, owner } = req.body;
  try {
    const newProject = await Project.create(title, owner);
    return res.status(201).json({ newProject });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const project = await Project.get(id);
    return res.json({ project });
  } catch (error) {
    return next(error);
  }
});
