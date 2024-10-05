const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    image: String,
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Feature", FeatureSchema);
