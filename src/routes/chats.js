const express = require("express");
const Chat = require("../models/chat.js");

const chatRouter = express.Router();

chatRouter.post("/chats", async (req, res) => {
  try {
    const { participants } = req.body;
    const chat = await Chat.findOne(
      {
        participants: { $all: participants },
      },
      { messages: 1 }
    );
    let messages = [];
    if (chat) {
      messages = chat.messages;
    }
    return res.status(200).send(messages);
  } catch (e) {
    console.log(e);
  }
});

chatRouter.post("/group-chats", async (req, res) => {
  try {
    const { participants } = req.body;
    const chat = await Chat.findOne(
      {
        participants: { $all: participants },
      },
      { messages: 1 }
    ).populate([
      {
        path: "messages.senderID",
        select: "firstName photoUrl",
      },
    ]);
    let messages = [];
    if (chat) {
      messages = chat.messages;
    }
    return res.status(200).send(messages);
  } catch (e) {
    console.log(e);
  }
});

module.exports = { chatRouter };
