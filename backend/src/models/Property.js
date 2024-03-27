const mongoose = require("mongoose");

const propertiesSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LandlordProfile",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  videos: [
    {
      type: String,
    },
  ],
  rentPrice: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  currentTenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TenantProfile",
  },
});

const Properties = mongoose.model("Properties", propertiesSchema);
module.exports = Properties;
