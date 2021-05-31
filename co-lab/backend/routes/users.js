const express = require("express");
const { tokenFactory } = require("../helperFuncs/token");
const { BadRequestError } = require("../expressError");

const User = require("../models/user");

const router = new express.Router();

router.get("/", async (req, res, next) => {
  const q = req.query;
  try {
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

router.get("/:username", async (req, res, next) => {
  try {
    const user = await User.getUser(req.params.username);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const newUser = await User.register({ ...req.body });
    const token = tokenFactory(newUser);
    return res.status(201).json({ token });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.authenticate(username, password);
    const token = tokenFactory(user);
    return res.json({ token });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:username", async (req, res, next) => {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
