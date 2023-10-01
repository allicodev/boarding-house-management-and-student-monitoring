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
    verification: {
      type: Array,
      default: {
        status: "pending",
        text: "",
        date: new Date(),
      },
      required: true,
    },
    establishmentPhotos: {
      type: Array,
      default: [],
    },
    businessPermitPhoto: {
      type: String,
    },
    totalSpaceForRent: {
      type: Number,
      required: true,
    },
    firstPaymentRule: {
      type: String,
    },
    type: {
      type: Array,
      default: [],
      // pad, boarding house, bed spacer, dormitory
    },
    inclusions: {
      type: Array,
      default: [],
    },
    restrictions: {
      type: Array,
      default: [],
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
