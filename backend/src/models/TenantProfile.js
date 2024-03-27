const mongoose = require("mongoose");

const tenantProfileSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  contactNumber: {
    type: String,
  },
  currentResidence: {
    type: String,
    ref: "Properties",
  },
  rentalHistory: [
    {
      type: String,
      ref: "Properties",
    },
  ],
});

const TenantProfile = mongoose.model("TenantProfile", tenantProfileSchema);
module.exports = TenantProfile;
