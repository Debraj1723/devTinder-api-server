const express = require("express");
const connectDB = require("./config/database.js");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const cron = require("./utils/cronjobs.js")

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

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established ...");
    app.listen(9000, () => {
      console.log("Server is running on port 9000...");
    });
  })
  .catch((e) => console.error("Database connection failed.",e));
