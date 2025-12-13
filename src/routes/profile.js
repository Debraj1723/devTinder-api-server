const express = require("express");

const profileRouter = express.Router();

const { authValidator } = require("../middlewares/auth.js");

const { validateUserProfileEdit } = require("../utils/validations.js");

const User = require("../models/user.js");

profileRouter.get("/profile", authValidator, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(404).send("Something went wrong");
  }
});

profileRouter.get("/profile-details/:id", authValidator, async (req, res) => {
  try {
    const profle = await User.findOne({_id:req.params.id});
    res.status(200).send(profle);
  } catch (e) {
    res.status(404).send("Something went wrong");
  }
});

profileRouter.patch("/profile/edit", authValidator, async (req, res) => {
  try {
    if (!validateUserProfileEdit(req))
      return res.status(400).send({ message: "Invalid data provided." });

    const data = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "User profile updated successfully", data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = { profileRouter };
