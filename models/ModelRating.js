
const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    vendorEmail: { type: String, required: true },
    citizenEmail: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

ratingSchema.index(
  { vendorEmail: 1, citizenEmail: 1 },
  { unique: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
