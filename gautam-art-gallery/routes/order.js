const express = require("express");
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");
const Painting = require("../models/Painting");

const router = express.Router();

/* PLACE ORDER */
router.post("/place", auth, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    let orderItems = [];

    for (let item of user.cart) {

      const painting = await Painting.findById(item.painting);

      if (!painting) continue;

      total += painting.price;

      orderItems.push({
        painting: painting._id,
        quantity: 1,
        size: item.size,
        framed: item.framed,
        price: painting.price
      });

      /* DECREASE STOCK */
      if (painting.stock > 0) {
        painting.stock -= 1;
        await painting.save();
      }
    }

    const order = new Order({
      user: user._id,
      items: orderItems,
      totalAmount: total
    });

    await order.save();

    /* CLEAR CART */
    user.cart = [];
    await user.save();

    res.json({ success: true, order });

  } catch (error) {
    console.log("ORDER ERROR:", error);
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
