const express = require('express');

const requestRouter = express.Router();

const { authValidator } = require("../middlewares/auth.js");



requestRouter.post("/send-connection-request", authValidator, async (req, res) => {
  try {
    res.status(200).send("Connection sent successfully");
  } catch (e) {
    res.status(404).send("Something went wrong");
  }
});

module.exports = { requestRouter };