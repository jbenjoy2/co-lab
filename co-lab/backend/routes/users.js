const express = require("express");
const { tokenFactory } = require("../helperFuncs/token");
const { BadRequestError } = require("../expressError");
const jsonschema = require("jsonschema");
const userSearchSchema = require("../schemas/userSearchSchema.json");
const userAuthSchema = require("../schemas/userAuthSchema.json");
const userNewSchema = require("../schemas/userNewSchema.json");
const requestResponseSchema = require("../schemas/requestResponseSchema.json");
const { checkCorrectUser, checkLoggedIn } = require("../Middleware/auth");
const User = require("../models/user");
const Request = require("../models/request");

const router = new express.Router();

router.get("/", checkLoggedIn, async (req, res, next) => {
  const q = req.query;
  try {
    const validation = jsonschema.validate(q, userSearchSchema);
    if (!validation.valid) {
      const errs = validation.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const users = await User.findAll(q);
    console.log(users.length);
    if (users.length > 0) {
      return res.json({ users });
    }
    return res.json("No users found that match your search!");
  } catch (error) {
    return next(error);
  }
});

router.get("/:username", checkLoggedIn, async (req, res, next) => {
  try {
    const user = await User.getUser(req.params.username);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body });
    const token = tokenFactory(newUser);
    return res.status(201).json({ token });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;

    const user = await User.authenticate(username, password);
    const token = tokenFactory(user);
    return res.json({ token });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:username", checkCorrectUser, async (req, res, next) => {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
