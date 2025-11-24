const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
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
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserID: 1, toUserID: 1 });

connectionRequestSchema.pre("validate", function (next) {
  const details = this;
  console.log(details);
  if (details.fromUserID.toString() === details.toUserID.toString()) {
    throw new Error("You cannot send yourself a request.");
  }
  next();
});

const connectionRequestSchemaModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequestSchemaModel;
