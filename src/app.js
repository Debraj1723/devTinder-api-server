const express = require("express");

const app = express();

app.use("/admin", (req, res, next) => {
  const token = "XYZx";
  if (token !== "XYZ") {
    res.status(401).json({ message: "Authentication failed" });
  } else {
    console.log("Authentication passed");
    next();
  }
});

app.get("/admin/getAllItems", (req, res) => {
  res.status(200).json({ message: "All items generated" });
});

app.delete("/admin/deleteAllItems", (req, res) => {
  res.status(200).json({ message: "All items deleted" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
