const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deletedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    name: {
      type: "String",
    },
    picture: [
      {
        type: "String",
        default:
          "https://cdn.pixabay.com/photo/2016/11/14/17/39/group-1824145_1280.png",
      },
    ],
    about: {
      type: "String",
    },
    active: { type: "Boolean", default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
