const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,

  setupDone: { type: Boolean, default: false },

  preferences: {
    purpose: String,
    distracting: [String],
    productive: [String]
  }
});

module.exports = mongoose.model("User", userSchema);