const express = require("express");
const { BadRequestError } = require("../expressError");

const Arrangement = require("../models/arrangement");
const jsonschema = require("jsonschema");
const arrangementUpdateSchema = require("../schemas/arrangementUpdateSchema.json");
const router = new express.Router();

router.get("/:projectID", async (req, res, next) => {
  try {
    const arrangement = await Arrangement.getAllForProject(req.params.projectID);

    return res.json({ arrangement });
  } catch (error) {
    return next(error);
  }
});
router.post("/:projectId", async (req, res, next) => {
  // create new one manually if front end is being weird;
  try {
    const arrangement = await Arrangement.create(req.params.projectId);

    return res.json({ created: arrangement.project_id });
  } catch (error) {
    if (error.code === "23503") {
      const bad = new BadRequestError("Could not create new arrangement");
      return next(bad);
    }
    return next(error);
  }
});

router.put("/:projectId", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, arrangementUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    //   find current state of arrangement
    const { data } = req.body;
    const current = await Arrangement.getAllForProject(req.params.projectId);

    // most recent version
    const currentIDs = new Set(current.map(r => r.id));
    // those in recent version that need to be updated...anything that is in the most recent version that is not in what is to be updated, should be removed
    const dataIds = new Set(data.map(r => r.id).filter(r => r !== undefined));

    // for all new data (the new state of the arrangement object)
    for (let id of currentIDs) {
      if (!dataIds.has(id)) {
        await Arrangement.remove(id);
      }
    }

    // iterate over all of the passed in data
    for (let arrangement of data) {
      // if it includes an ID, it needs to be updated, otherwise it needs to be added
      if (arrangement.id) {
        //   the other case here is that an id is included but for some reason that id isn't in the current. If that's the case then either it's being edited externally instead of from the front end, or its a mistake so it can be ignored altogether
        if (currentIDs.has(arrangement.id)) {
          await Arrangement.update(arrangement.id, arrangement.position);
        }
      } else {
        Arrangement.add(req.params.projectId, arrangement.section, arrangement.position);
      }
    }
    return res.json({ updated: `project${req.params.projectId} arrangement` });
  } catch (error) {
    return next(error);
  }
});
// this route does NOT delete entirely from the table, but instead triggers the "clear" method on the arrangement model to restart from scratch (fast way to clear out instead of moving everything one by one)
router.delete("/:projectId/clear", async (req, res, next) => {
  try {
    await Arrangement.clear(req.params.projectId);
    return res.json({ "arrangement reset": req.params.projectId });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
