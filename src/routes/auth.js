const express = require("express");

const authRouter = express.Router();

const User = require("../models/user.js");
const Code = require("../models/code.js");

const { validateUserAddition } = require("../utils/validations.js");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    validateUserAddition(req);
    let { password, firstName, lastName, email } = req.body;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).send({ message: "User already exists." });
    }
    let encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      password: encryptedPassword,
      firstName: firstName,
      lastName: lastName,
      email: email,
    });

    const savedUser = await user.save();

    const token = await savedUser.getToken();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60000),
    });
    res.status(200).send(savedUser);
  } catch (err) {
    res.status(400).send(err.message);
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
      res.status(200).send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send("Logout successful!");
  } catch (e) {
    res.status(404).send(e.message);
  }
});

authRouter.get("/generate-otp", async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    const userExists = await User.findOne({ email: email });

    if (!userExists) {
      return res.status(400).send("User with this email ID does not exist.");
    }

    const generateOtp = () => {
      let otp = "";
      let i = 4;
      while (i > 0) {
        otp += Math.floor(Math.random() * 10);
        i--;
      }
      return otp;
    };

    let codeData = await Code.findOne({ email: email });

    let otp = "";

    if (codeData && isValidOtp(codeData.createdAt)) {
      otp = codeData.otp;
    } else {
      otp = generateOtp();
      console.log({
        otp: otp,
        email: email,
      });

      await Code.create({
        otp: otp,
        email: email,
      });
    }

    //actually should send otp to the given email;
    res.status(200).send(`Your otp is - ${otp}`);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

authRouter.patch("/reset-password", async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).send("User with this email ID does not exist.");
    }

    let codeData = await Code.findOne({ email: email }).sort({ createdAt: -1 });

    if (!codeData || codeData.otp !== otp || !isValidOtp(codeData.createdAt)) {
      return res.status(400).send("Invalid otp");
    }

    let encryptedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email: email },
      { $set: { password: encryptedPassword } }
    );

    res.status(200).send(`Your password has been reset`);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

function isValidOtp(time) {
  const currentTime = new Date();
  const givenTime = new Date(time);

  const diffInMs = currentTime - givenTime;

  const diffInMinutes = diffInMs / (1000 * 60);
  return diffInMinutes < 1;
}

module.exports = { authRouter };
