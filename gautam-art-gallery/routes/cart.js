const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Painting = require("../models/Painting");

const router = express.Router();

/* ADD TO CART */
router.post("/add", auth, async (req, res) => {
  const { paintingId, size, framed } = req.body;

  const user = await User.findById(req.user.id);
  const painting = await Painting.findById(paintingId);

  if (!painting || painting.stock <= 0) {
    return res.status(400).json({ message: "Out of stock" });
  }

  user.cart.push({
    painting: paintingId,
    size,
    framed
  });

  await user.save();

  res.json({ success: true });
});

/* GET CART */
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("cart.painting");
  res.json(user.cart);
});

/* REMOVE ITEM */
router.post("/remove", auth, async (req, res) => {
  const { index } = req.body;

  const user = await User.findById(req.user.id);

  user.cart.splice(index, 1);

  await user.save();

  res.json({ success: true });
});

module.exports = router;
