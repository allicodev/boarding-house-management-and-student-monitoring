let mongoose = require("mongoose");

let EstablishmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      type: Array,
      default: [0, 0],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      required: true,
    },
    establishmentPhotos: {
      type: Array,
      default: [],
    },
    businessPermitPhoto: {
      type: String,
      required: false,
    },
    totalVacantTenant: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Establishment ||
  mongoose.model("Establishment", EstablishmentSchema);
