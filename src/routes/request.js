const express = require("express");

const requestRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest.js");

const { authValidator } = require("../middlewares/auth.js");
const User = require("../models/user.js");

const { sendEmail } = require("../utils/sendEmail.js");

requestRouter.post(
  "/request/send/:status/:id",
  authValidator,
  async (req, res) => {
    try {
      const toUserExistance = await User.findById(req.params.id);
      if (!toUserExistance) {
        return res.status(400).send("To user not found.");
      }
      const acceptedStatus = ["Ignored", "Interested"];

      const fromUserID = req.user._id;

      const toUserID = req.params.id;
      
      const status = req.params.status;

      if (!acceptedStatus.includes(status)) {
        return res.status(400).send("Invalid status detected");
      }

      const requestExist = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserID,
            toUserID,
          },
          {
            fromUserID: toUserID,
            toUserID: fromUserID,
          },
        ],
      });

      if (requestExist) {
        return res.status(404).send("Connection request already exist.");
      }

      await ConnectionRequest.create({
        fromUserID,
        toUserID,
        status,
      });

      // if (req.params.status === "Interested") {
      //   const emailTemplate = `<h1>${toUserExistance.firstName} sent you a connection request.</h1>`;
      //   const mail = await sendEmail(
      //     ["debraj.basak23@gmail.com"],
      //     "New Connection request received",
      //     emailTemplate
      //   );
      //   console.log(mail);
      // }

      res.status(200).send("Connection sent successfully");
    } catch (e) {
      console.log(e);
      res.status(404).send("Something went wrong");
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestID",
  authValidator,
  async (req, res) => {
    try {
      const acceptedStatus = ["Accepted", "Rejected"];

      if (!acceptedStatus.includes(req.params.status)) {
        res.status(400).send("Invalid status provided");
      }

      const requestInfo = await ConnectionRequest.findOne({
        _id: req.params.requestID,
        status: "Interested",
        toUserID: req.user._id,
      });

      if (!requestInfo) res.status(400).send("Request doesnt exisit.");

      await ConnectionRequest.findOneAndUpdate(
        {
          _id: req.params.requestID,
        },
        { $set: { status: req.params.status } }
      );

      res.status(200).send("Connection reviewed successfully");
    } catch (e) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = { requestRouter };
