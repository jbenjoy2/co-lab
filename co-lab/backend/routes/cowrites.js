const express = require("express");
const { BadRequestError } = require("../expressError");

const Project = require("../models/project");

const router = new express.Router();

router.delete("/", async (req, res, next) => {
  const { projectId, username } = req.body;
  try {
    await Project.leave(projectId, username);
    return res.json({ removed: req.body.username });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
