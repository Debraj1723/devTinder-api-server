const socket = require("socket.io");
const Chat = require("../models/chat.js");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ receiver, sender }) => {
      const roomID = [receiver, sender].sort().join("$");
      console.log("joining room :" + roomID);
      socket.join(roomID);
    });

    socket.on("sendMessage", async ({ receiver, sender, text }) => {
      const roomID = [receiver, sender].sort().join("$");
      io.to(roomID).emit("messageReceived", { receiver, sender, text });

      try {
        let chat = await Chat.findOne({
          participants: { $all: [receiver, sender] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [receiver, sender],
            messages: [],
          });
        }

        chat.messages.push({ senderID: sender, text });

        await chat.save();
      } catch (e) {
        console.log(e.message);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
