let mongoose = require("mongoose");

let TenantSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    establishmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establishment",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema);
