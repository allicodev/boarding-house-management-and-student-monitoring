let mongoose = require("mongoose");

// * only applicable to student
let ArchiveSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    establishmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establishment",
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Archive ||
  mongoose.model("Archive", ArchiveSchema);
