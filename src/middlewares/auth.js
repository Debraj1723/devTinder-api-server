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

module.exports = { adminAuth, userAuth };
