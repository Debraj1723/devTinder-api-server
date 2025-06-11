const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [4, "Please mention your original name, {VALUE} is too short"],
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Given email ID is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate: function (value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Weak password :( . Your pass should include { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }"
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Given string is an invalid url");
        }
      },
      default:
        "https://cdni.iconscout.com/illustration/premium/thumb/male-user-image-illustration-download-in-svg-png-gif-file-formats--person-picture-profile-business-pack-illustrations-6515860.png",
    },
    about: {
      type: String,
      default: "Hey there i am using dev tinder",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
