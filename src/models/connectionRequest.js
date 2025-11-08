const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["Ignored", "Interested", "Accepted", "Rejected"],
    },
  }
},{timestamps:true});

const connectionRequestSchemaModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = connectionRequestSchemaModel;
