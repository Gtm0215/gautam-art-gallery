const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  image: String,
  likes: { type: Number, default: 0 },
  isHero: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Painting", paintingSchema);
