const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  stock: Number,
  sizes: [String],
  framedOptions: [String],
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model("Painting", paintingSchema);
