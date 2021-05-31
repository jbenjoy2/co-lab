const express = require("express");
const { BadRequestError } = require("../expressError");

const Request = require("../models/request");

const router = new express.Router();

router.post("/new", async (req, res, next) => {
  try {
    const { project_id, sender, recipient } = req.body;

    const newRequest = await Request.makeRequest(project_id, sender, recipient);

    return res.status(201).json({ newRequest });
  } catch (error) {
    if (error.code === "23503") {
      error.message = "Could not send request- user not found";
    }
    return next(error);
  }
});
module.exports = router;
