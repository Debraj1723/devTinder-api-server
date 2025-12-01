const express = require("express");

const userRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");

const { authValidator } = require("../middlewares/auth");

const User = require("../models/user");

userRouter.get("/users/requests", authValidator, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      toUserID: req.user._id,
      status: "Interested",
    }).populate("fromUserID");
    return res.status(200).send(requests);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

userRouter.get("/users/connections", authValidator, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    let connections = await ConnectionRequest.find({
      status: "Accepted",
      $or: [{ fromUserID: loggedInUser }, { toUserID: loggedInUser }],
    })
      .populate("fromUserID")
      .populate("toUserID");

    let finalArray = [];

    connections.forEach((e) => {
      if (e.fromUserID._id.toString() !== loggedInUser.toString()) {
        finalArray.push(e.fromUserID);
      }
      
      if (e.toUserID._id.toString() !== loggedInUser.toString()) {
        finalArray.push(e.toUserID);
      }
    });

    return res.status(200).send(finalArray);
  } catch (e) {
    res.status(404).send({ message: e.message });
  }
});

userRouter.get("/feed", authValidator, async (req, res) => {
  console.log("Feed route accessed");
  try {
    let page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const loggedInUser = req.user._id;

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserID: loggedInUser }, { toUserID: loggedInUser }],
    });

    let blockedUserIDs = new Set();

    connections.forEach((e) => {
      blockedUserIDs.add(e.fromUserID);
      blockedUserIDs.add(e.toUserID);
    });

    const users = await User.find({
      _id: { $nin: Array.from(blockedUserIDs) },
    })
      .skip(skip)
      .limit(limit);

    return res.status(200).send(users);
  } catch (e) {
    res.status(404).send({ message: e.message });
  }
});

module.exports = { userRouter };
