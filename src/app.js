const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Debraj", lastName: "Basak", type: "GET" });
});

app.post("/user", (req, res) => {
  res.send({
    firstName: "Debraj",
    lastName: "Basak",
    type: "POST",
    query: req.query,
  });
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

app.use(
  "/multi-handlers",
  (req, res) => {
    console.log("response from first handler");
    res.send("response from first handler");
  },
  (req, res) => {
    console.log("response from second handler");
    res.send("response from second handler");
  }
);

app.use("/multi-handlers-second", [
  (req, res, next) => {
    console.log("response from first handler");
    next();
    // res.send("response from first handler");
  },
  (req, res, next) => {
    console.log("response from second handler");
    res.send("response from second handler");
    console.log("triggered");
    next();
  },
]);

app.use("/multi-handlers-diffrent-ways", (req, res, next) => {
  console.log("response from first handler");
  next();
  // res.send("response from first handler");
});

app.use("/multi-handlers-diffrent-ways", (req, res, next) => {
  console.log("response from second handler");
  res.send("response from second handler");
  console.log("triggered");
  next();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
