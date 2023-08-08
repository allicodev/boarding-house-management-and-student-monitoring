let mongoose = require("mongoose");

let UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    // for student
    idNumber: {
      type: String,
      unique: true,
      required: false,
    },
    college: {
      type: String,
    },
    year: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dateOfBirth: {
      type: Date,
    },
    // end for student
    role: {
      type: String,
      enum: ["admin", "landlord", "student"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
