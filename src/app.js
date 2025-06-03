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
