const express = require("express");
const auth = require("../middleware/auth");
const Painting = require("../models/Painting");

const router = express.Router();

let cart = [];

router.post("/add", auth, async (req, res) => {
  const { paintingId, size, framed } = req.body;

  const painting = await Painting.findById(paintingId);
  if (!painting || painting.stock <= 0)
    return res.status(400).json({ message: "Out of stock" });

  cart.push({ painting, size, framed });
  res.json({ success: true });
});

router.get("/", auth, (req, res) => {
  res.json(cart);
});

module.exports = router;
