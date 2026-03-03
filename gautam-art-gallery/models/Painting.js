const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  image: String,
  likes: { type: Number, default: 0 },

  // NEW FIELDS
  isFeatured: { type: Boolean, default: false },
  isHero: { type: Boolean, default: false },
  section: { type: String, default: "featured" } 
  // values: hero, explore, featured
});

module.exports = mongoose.model("Painting", paintingSchema);
