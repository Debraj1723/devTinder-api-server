const express = require('express');

const requestRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest.js")

const { authValidator } = require("../middlewares/auth.js");



requestRouter.post("request/send/interested/:id", authValidator, async (req, res) => {
  try {
    const commonBody = {
      fromUserID:req.user._id,
      toUserID:req.params._id,
      status:"Interested"
    }

    const requestExist = await ConnectionRequest.findOne(commonBody)
    if(!requestExist){
      await ConnectionRequest.create(commonBody);
    }
    
    res.status(200).send("Connection sent successfully");
  } catch (e) {
    res.status(404).send("Something went wrong");
  }
});

module.exports = { requestRouter };