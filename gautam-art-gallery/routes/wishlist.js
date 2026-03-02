const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/* TOGGLE WISHLIST */
router.post("/toggle", auth, async (req, res) => {
  const { paintingId } = req.body;

  const user = await User.findById(req.user.id);

  const index = user.wishlist.indexOf(paintingId);

  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(paintingId);
  }

  await user.save();

  res.json({ success: true });
});

/* GET WISHLIST */
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("wishlist");
  res.json(user.wishlist);
});

module.exports = router;
