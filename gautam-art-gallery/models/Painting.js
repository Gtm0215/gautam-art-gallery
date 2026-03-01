const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: String,
    image: String,
    likes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Painting", paintingSchema);
