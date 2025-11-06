const express = require("express");

const authRouter = express.Router();

const User = require("../models/user.js");
const { validateUserAddition } = require("../utils/validations.js");
const bcrypt = require("bcrypt");
const validator = require("validator");



authRouter.post("/signup", async (req, res) => {
  try {
    validateUserAddition(req);
    let { password, firstName, lastName, age, gender, email } = req.body;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(400).send({ message: "User already exists." });
      return;
    }
    let encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      password: encryptedPassword,
      firstName: firstName,
      lastName: lastName,
      age: age,
      gender: gender,
      email: email,
    });
    await user.save();
    res.status(200).json({ message: "User saved successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) throw new Error("Invalid email id given");
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid credentials");
    let isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = await user.getToken();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 60000),
      });
      res.status(200).send("Login successful!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
});

module.exports = { authRouter };
