const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema({

  title: String,
  description: String,
  price: Number,
  stock: Number,
  image: String,

  isHero: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false }

});

module.exports = mongoose.model("Painting", paintingSchema);
