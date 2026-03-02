const express = require("express");
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");
const Painting = require("../models/Painting");

const router = express.Router();

/* PLACE ORDER */
router.post("/place", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.painting");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    const items = user.cart.map(item => {
      total += item.painting.price;

      return {
        painting: item.painting._id,
        quantity: 1,
        size: item.size,
        framed: item.framed,
        price: item.painting.price
      };
    });

    const order = new Order({
      user: user._id,
      items,
      totalAmount: total
    });

    await order.save();

    /* AUTO STOCK DECREASE */
    for (let item of user.cart) {
      await Painting.findByIdAndUpdate(
        item.painting._id,
        { $inc: { stock: -1 } }
      );
    }

    /* CLEAR CART */
    user.cart = [];
    await user.save();

    res.json({ success: true, order });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* USER ORDERS */
router.get("/my", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.painting");

  res.json(orders);
});

/* ADMIN VIEW ALL ORDERS */
router.get("/all", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const orders = await Order.find()
    .populate("user")
    .populate("items.painting");

  res.json(orders);
});

module.exports = router;
