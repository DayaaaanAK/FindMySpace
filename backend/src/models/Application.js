const mongoose = require("mongoose");

const applicationsSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    required: true,
  },
  tenantId: {
    type: String,
    ref: "TenantProfile",
    required: true,
  },
  propertyId: {
    type: String,
    ref: "Properties",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Applications = mongoose.model("Applications", applicationsSchema);
module.exports = Applications;
