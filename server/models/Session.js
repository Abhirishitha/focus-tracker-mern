const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  url: String,
  timeSpent: Number,
  userId: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);