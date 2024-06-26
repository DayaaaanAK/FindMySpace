const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["landlord", "tenant"],
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
