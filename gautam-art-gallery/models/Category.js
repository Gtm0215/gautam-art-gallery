const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  image: String,
  position: Number
});

module.exports = mongoose.model("Category", categorySchema);
