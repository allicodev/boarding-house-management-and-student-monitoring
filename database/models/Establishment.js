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
      default: "pending",
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
    totalSpaceForRent: {
      type: Number,
      required: true,
    },
    // type: {
    //   type: String,
    //   enum: ["male", "female", "mix"],
    // },
  },
  { timestamps: true }
);

export default mongoose.models.Establishment ||
  mongoose.model("Establishment", EstablishmentSchema);
