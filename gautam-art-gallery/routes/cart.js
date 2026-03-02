const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Painting = require("../models/Painting");

const router = express.Router();

/* ADD TO CART */
router.post("/add", auth, async (req, res) => {
  try {
    const { paintingId, size, framed } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET CART */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.painting");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cart);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* REMOVE ITEM */
router.post("/remove", auth, async (req, res) => {
  try {
    const { index } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart.splice(index, 1);
    await user.save();

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
