const express = require("express");
const { BadRequestError } = require("../expressError");

const Request = require("../models/request");

const router = new express.Router();

router.post("/new", async (req, res, next) => {
  const { project_id, sender, recipient } = req.body;
  try {
    const newRequest = await Request.makeRequest(project_id, sender, recipient);

    console.log(newRequest);

    return res.status(201).json({ newRequest });
  } catch (error) {
    if (error.code === "23503") {
      console.log(error);
      if (error.constraint === "requests_recipient_fkey") {
        error.message = `Could not send request- recipient ${recipient} not found`;
      } else if (error.constraint === "requests_sender_fkey") {
        error.message = `Could not send request- sender ${sender} not found`;
      } else error.message = `Could not send request- project with id ${project_id} not found`;
    }
    return next(error);
  }
});
module.exports = router;
