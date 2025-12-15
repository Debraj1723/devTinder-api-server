const express = require("express");
const connectDB = require("./config/database.js");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const cron = require("./utils/cronjobs.js");
const initializeSocket = require("./utils/socket.js");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//processes json
app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const { requestRouter } = require("./routes/request.js");
const { userRouter } = require("./routes/user.js");
const { chatRouter } = require("./routes/chats.js");
const { groupRouter } = require("./routes/group.js");

const http = require("http");

const server = http.createServer(app);

initializeSocket(server);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", groupRouter);

connectDB()
  .then(() => {
    console.log("Database connection established ...");
    server.listen(9000, () => {
      console.log("Server is running on port 9000...");
    });
  })
  .catch((e) => console.error("Database connection failed.", e));
