const express = require("express");
const groupRouter = express.Router();

const Group = require("../models/group.js");
const { authValidator } = require("../middlewares/auth");

groupRouter.post("/groups/create", authValidator, async (req, res) => {
  try {
    const { members, admins, name, picture, about } = req.body;

    const group = new Group({
      members,
      admins,
      name,
      picture,
      about,
      deletedMembers: [],
    });
    await group.save();

    res.status(200).json({ message: "Group has been updated successfully" });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

groupRouter.post("/groups/add-members", authValidator, async (req, res) => {
  try {
    const { _id, newMembers } = req.body;

    await Group.findByIdAndUpdate(_id, {
      $addToSet: {
        members: { $each: newMembers },
      },
    });

    res.status(200).json({ message: "New members successfully added" });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

groupRouter.post("/groups/remove-member", authValidator, async (req, res) => {
  try {
    const { _id, member } = req.body;

    await Group.findByIdAndUpdate(_id, {
      $pull: { members: member },
      $addToSet: { deletedMembers: member },
    });

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

groupRouter.get("/groups/get-list", authValidator, async (req, res) => {
  try {
    const groups = await Group.find({
      members: { $in: [req.user._id] },
      active: true,
    });

    res.status(200).json(groups);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

groupRouter.get("/groups/details/:id", authValidator, async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id,
    });
    res.status(200).json(group);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = { groupRouter };
