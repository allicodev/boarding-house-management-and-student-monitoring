let mongoose = require("mongoose");

let RequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    establishmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establishment",
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Request ||
  mongoose.model("Request", RequestSchema);
