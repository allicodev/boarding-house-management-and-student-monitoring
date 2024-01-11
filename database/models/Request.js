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
      enum: [
        "pending",
        "accepted",
        "rejected",
        "draft",
        "cancelled",
        "archived",
      ],
      default: "pending",
    },
    declineReason: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    studentSignature: {
      type: Buffer,
    },
    landlordSignature: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Request ||
  mongoose.model("Request", RequestSchema);
