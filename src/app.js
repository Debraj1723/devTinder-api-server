const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

app.post("/signup", async (req, res) => {
  try {
    const user = new User({
      firstName: "Manohar",
      lastName: "Dalal",
      age: 45,
      gender: "Male",
      email: "debraj.basak663@gmail.com",
      password: "Debraj1234",
    });
    await user.save();
    res.status(200).json({ message: "User saved successfully" });
  } catch (err) {
    res.status(400).status({ message: err.message });
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established ...");
    app.listen(3000, () => {
      console.log("Server is running on port 3000...");
    });
  })
  .catch(() => console.error("Database connection failed."));
