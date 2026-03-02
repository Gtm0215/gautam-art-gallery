const express = require("express");
const multer = require("multer");
const Painting = require("../models/Painting");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/* ==============================
   MULTER CONFIG
============================== */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ==============================
   ADD PAINTING (ADMIN ONLY)
============================== */

router.post("/add", auth, upload.single("image"), async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, price, stock } = req.body;

    const painting = new Painting({
      title,
      description,
      price: Number(price),
      stock: Number(stock),
      image: "/uploads/" + req.file.filename,
      likes: 0,
      sizes: ["A4", "A3", "A2"],
      framedOptions: ["Framed", "Unframed"]
    });

    await painting.save();

    res.json({ success: true, painting });

  } catch (error) {
    console.log("ADD PAINTING ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   GET ALL PAINTINGS
============================== */

router.get("/", async (req, res) => {
  try {
    const paintings = await Painting.find();
    res.json(paintings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   LIKE PAINTING
============================== */

router.post("/like/:id", async (req, res) => {
  try {
    await Painting.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } }
    );

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   EDIT PAINTING (ADMIN ONLY)
============================== */

router.put("/edit/:id", auth, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, price, stock } = req.body;

    const painting = await Painting.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price: Number(price),
        stock: Number(stock)
      },
      { new: true }
    );

    res.json({ success: true, painting });

  } catch (error) {
    console.log("EDIT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   DELETE PAINTING (ADMIN ONLY)
============================== */

router.delete("/delete/:id", auth, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Painting.findByIdAndDelete(req.params.id);

    res.json({ success: true });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
