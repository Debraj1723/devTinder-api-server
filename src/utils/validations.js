const validator = require("validator");

const validateUserAddition = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateUserProfileEdit = (req) => {
  const acceptableFields = [
    "firstName",
    "lastName",
    "email",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills"
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>{
    return acceptableFields.includes(field);
  })
  return isEditAllowed;
};


module.exports = { validateUserAddition,validateUserProfileEdit };
