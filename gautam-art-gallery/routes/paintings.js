const express = require("express");
const router = express.Router();
const multer = require("multer");
const Painting = require("../models/Painting");
const authMiddleware = require("../middleware/auth");

/* ===============================
   IMAGE STORAGE (FIXED VERSION)
================================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {

    // CLEAN FILE NAME (REMOVE SPACES + SPECIAL CHARACTERS)
    const cleanName = file.originalname
      .replace(/\s+/g, "-")          // replace spaces with dash
      .replace(/[^\w.-]/g, "");      // remove weird characters

    cb(null, Date.now() + "-" + cleanName);
  }
});

const upload = multer({ storage });

/* ===============================
   GET ALL PAINTINGS
================================= */
router.get("/", async (req, res) => {
  try {
    const paintings = await Painting.find();
    res.json(paintings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   ADD PAINTING (ADMIN ONLY)
================================= */
router.post("/add", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const { title, description, price, stock } = req.body;

    const newPainting = new Painting({
      title,
      description,
      price: Number(price),
      stock: Number(stock),
      image: "/uploads/" + req.file.filename,
      likes: 0
    });

    await newPainting.save();

    res.json({ success: true, painting: newPainting });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   EDIT PAINTING (ADMIN ONLY)
================================= */
router.put("/edit/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { title, description, price, stock } = req.body;

    const updated = await Painting.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price: Number(price),
        stock: Number(stock)
      },
      { new: true }
    );

    res.json({ success: true, painting: updated });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   DELETE PAINTING (ADMIN ONLY)
================================= */
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    await Painting.findByIdAndDelete(req.params.id);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   LIKE PAINTING
================================= */
router.post("/like/:id", async (req, res) => {
  try {
    const painting = await Painting.findById(req.params.id);

    if (!painting) {
      return res.status(404).json({ message: "Painting not found" });
    }

    painting.likes += 1;
    await painting.save();

    res.json({ success: true, likes: painting.likes });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
