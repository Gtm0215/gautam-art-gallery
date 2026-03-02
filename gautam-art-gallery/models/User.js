const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Painting" }],

  cart: [
    {
      painting: { type: mongoose.Schema.Types.ObjectId, ref: "Painting" },
      quantity: { type: Number, default: 1 },
      size: String,
      framed: String
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
