const express = require("express");

const profileRouter = express.Router();

const { authValidator } = require("../middlewares/auth.js");


profileRouter.get("/profile", authValidator, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(404).send("Something went wrong");
  }
});

module.exports = { profileRouter };
