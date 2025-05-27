const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Debraj", lastName: "Basak", type: "GET" });
});

app.post("/user", (req, res) => {
  res.send({ firstName: "Debraj", lastName: "Basak", type: "POST" });
});

app.delete("/user", (req, res) => {
  res.send({ firstName: "Debraj", lastName: "Basak", type: "DELETE" });
});

app.put("/user", (req, res) => {
  res.send({ firstName: "Debraj", lastName: "Basak", type: "PUT" });
});

app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
