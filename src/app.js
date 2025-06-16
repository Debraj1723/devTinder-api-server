const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { validateUserAddition } = require("./utils/validations.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");

const app = express();

//processes json
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateUserAddition(req);
    let { password, firstName, lastName, age, gender, email } = req.body;
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) throw new Error("Invalid email id given");
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid credentials");
    let isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      res.cookie("token", "123jb1k2j3bk12j3k123k1h");
      res.status(200).send("Login successful!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    console.log(req.cookies);
    const userEmail = req.body.email;
    const userDetails = await User.find({ email: userEmail });
    res.status(200).send(userDetails);
  } catch (e) {
    res.status(404).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userID = req.body.user;
    await User.findByIdAndDelete(userID);
    res.status(200).send("User deleted successfully.");
  } catch (e) {
    res.send(404).send("Something went wrong.");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const feed = await User.find({});
    res.status(200).json(feed);
  } catch (e) {
    res.send(404).send("Something went wrong.");
  }
});

app.patch("/user", async (req, res) => {
  try {
    const userID = req.body._id;
    const userBody = req.body;
    const ALLOWED_UPDATES = [
      "_id",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(userBody).every((e) => {
      return ALLOWED_UPDATES.includes(e);
    });

    if (!isUpdateAllowed) {
      return res.status(400).send("Updation not allowed");
    }
    const user = await User.findByIdAndUpdate(userID, userBody, {
      runValidators: true,
    });
    res.status(200).send("User has been updated successfully");
  } catch (e) {
    res.send(404).send("Something went wrong.");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established ...");
    app.listen(9000, () => {
      console.log("Server is running on port 9000...");
    });
  })
  .catch(() => console.error("Database connection failed."));
