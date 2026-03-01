const mongoose = require("mongoose");

const PaintingSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
});

module.exports = mongoose.model("Painting", PaintingSchema);