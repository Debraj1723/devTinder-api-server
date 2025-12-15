const socket = require("socket.io");
const Chat = require("../models/chat.js");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ participants }) => {
      const roomID = [...participants].sort().join("$");
      socket.join(roomID);
    });

    socket.on("sendMessage", async ({ participants, sender, text }) => {
      const roomID = [...participants].sort().join("$");
      io.to(roomID).emit("messageReceived", { sender, text });

      try {
        let chat = await Chat.findOne({
          participants: { $all: participants },
        });
        if (!chat) {
          chat = new Chat({
            participants: participants,
            messages: [],
          });
        }
        chat.messages.push({ senderID: sender, text });
        await chat.save();
      } catch (e) {
        console.log(e.message);
      }
    });

    socket.on(
      "sendGroupMessage",
      async ({ participants, sender, senderName, text }) => {
        const roomID = [...participants].sort().join("$");
        io.to(roomID).emit("groupMessageReceived", { sender, senderName, text });

        try {
          let chat = await Chat.findOne({
            participants: { $all: participants },
          });
          if (!chat) {
            chat = new Chat({
              participants: participants,
              messages: [],
            });
          }
          chat.messages.push({ senderID: sender, text });
          await chat.save();
        } catch (e) {
          console.log(e.message);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
