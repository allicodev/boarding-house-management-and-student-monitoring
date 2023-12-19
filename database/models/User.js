let mongoose = require("mongoose");

let HistorySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    isViolation: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, _id: false }
);

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
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    // for student
    idNumber: {
      type: String,
    },
    idPhoto: {
      type: String,
      default: "",
    },
    college: {
      type: String,
    },
    course: {
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
    history: {
      type: [HistorySchema],
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
