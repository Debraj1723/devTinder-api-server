const express = require("express");

const app = express();

const { adminAuth } = require("./middlewares/auth.js");

app.use("/admin", adminAuth);

app.get("/admin/getAllItems", (req, res) => {
  res.status(200).json({ message: "All items generated" });
});

app.delete("/admin/deleteAllItems", (req, res) => {
  res.status(200).json({ message: "All items deleted" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
