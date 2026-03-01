const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Painting", paintingSchema);
