const express = require("express");
const { BadRequestError } = require("../expressError");

const Request = require("../models/request");

const router = new express.Router();

router.post("/new", async (req, res, next) => {
  const { project_id, sender, recipient } = req.body;
  console.log(project_id, sender, recipient);
  try {
    const newRequest = await Request.makeRequest(project_id, sender, recipient);

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

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { response } = req.body;
  try {
    if (response === "accept") {
      const accepted = await Request.accept(id);
      console.log(accepted);
      return res.json({ accepted });
    } else if (response === "reject") {
      const rejected = Request.reject(id);
      return res.json({ rejected });
    } else {
      throw new BadRequestError("Please either reject or accept the request");
    }
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
