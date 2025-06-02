const express = require("express");

const app = express();

//// all http calls

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

///  multi handlers

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

///  more on multi handlers

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

//////////////// middlewares explained

const { adminAuth, userAuth } = require("./middlewares/auth.js");

app.use("/admin", adminAuth);

app.get("/admin/getAllItems", (req, res) => {
  res.status(200).json({ message: "All items generated" });
});

app.delete("/admin/deleteAllItems", (req, res) => {
  res.status(200).json({ message: "All items deleted" });
});

/////////////////////// Handling errors

// first way of handling error
app.get("/getUserSummary", (req, res) => {
  throw new error("Something went wrong");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send(err);
  }
});

// second way of handling error
app.get("/getUserSummary", (req, res) => {
  try {
    throw new Error("Something went wrong pls try again");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
