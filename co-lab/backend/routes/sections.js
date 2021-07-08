const express = require("express");
const { BadRequestError } = require("../expressError");

const Section = require("../models/section");

const router = new express.Router();
/** GET /  =>  { sections }
 *
 * Authorization required: NONE
 **/
router.get("/", async (req, res, next) => {
  try {
    const sections = await Section.getAll();
    return res.json({ sections });
  } catch (error) {
    return next(error);
  }
});
/** GET /[id]  =>  { section: {id, name} }
 *
 * Authorization required: none
 **/
router.get("/:id", async (req, res, next) => {
  try {
    const section = await Section.get(req.params.id);
    return res.json({ section });
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
