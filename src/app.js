const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

//processes json
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // we are not creating .create method now but this is equivalent to it as we are creating an instance before saving it
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: "User saved successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const userDetails = await User.find({ email: userEmail });
    res.status(200).send(userDetails);
  } catch (e) {
    res.status(404).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    console.log("asdasd");
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
