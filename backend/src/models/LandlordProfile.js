const mongoose = require("mongoose");

const landlordProfileSchema = new mongoose.Schema({
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
  propertiesOwned: [
    {
      type: String,
      ref: "Properties",
    },
  ],
});

const LandlordProfile = mongoose.model(
  "LandlordProfile",
  landlordProfileSchema
);
module.exports = LandlordProfile;
