const express = require("express");
const { BadRequestError } = require("../expressError");
const jsonschema = require("jsonschema");
const requestNewSchema = require("../schemas/requestNewSchema.json");
const requestResponseSchema = require("../schemas/requestResponseSchema.json");
const Request = require("../models/request");
const { checkCorrectUser } = require("../Middleware/auth");

const router = new express.Router();

router.get("/:username", checkCorrectUser, async (req, res, next) => {
  const recipient = req.params.username;

  try {
    const userRequests = await Request.getRequestsForUser(recipient);

    if (!userRequests.length) {
      return res.json("No requests!");
    }
    return res.json({ userRequests });
  } catch (error) {
    return next(error);
  }
});
router.post("/:username/new", checkCorrectUser, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, requestNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const sender = req.params.username;
    const { project_id, recipient } = req.body;
    const newRequest = await Request.makeRequest(project_id, sender, recipient);

    return res.status(201).json({ newRequest });
  } catch (error) {
    if (error.code === "23503") {
      console.log(error);
      if (error.constraint === "requests_recipient_fkey") {
        error.message = `Could not send request- recipient ${req.body.recipient} not found`;
      } else if (error.constraint === "requests_sender_fkey") {
        error.message = `Could not send request- sender ${req.body.sender} not found`;
      } else
        error.message = `Could not send request- project with id ${req.body.project_id} not found`;
    }
    return next(error);
  }
});

module.exports = router;
