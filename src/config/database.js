require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  const url =
    "mongodb+srv://" +
    process.env.MONGO_ACCESS_USERNAME +
    ":" +
    process.env.MONGO_ACCESS_PASSWORD +
    "@namastenode.og4ndjv.mongodb.net/";
  const dbName = "devTinder";
  await mongoose.connect(url +dbName);
};

module.exports = connectDB;
