const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const adminAuth = (req, res, next) => {
  let token = "XYZ";
  if (token === "XYZ") {
    console.log("Authentication passed");
    next();
  } else {
    res.status(401).json({ message: "Admin authentication failed" });
  }
};

const userAuth = (req, res, next) => {
  let token = "XYZ";
  if (token === "XYZ") {
    console.log("User authentication passed");
    next();
  } else {
    res.status(401).json({ message: "User authentication failed" });
  }
};

const authValidator = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Please Login!");
    const decodedObj = await jwt.verify(token, process.env.SECRET_KEY);
    const { _id } = decodedObj;
    const user = await User.findOne({ _id: _id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (e) {
    return res.status(500).json({ message: "Token Expired" });
  }
};

module.exports = { adminAuth, userAuth, authValidator };
