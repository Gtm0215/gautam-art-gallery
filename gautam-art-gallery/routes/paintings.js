const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Painting = require("../models/Painting");


// ============================
// MULTER CONFIG (IMAGE UPLOAD)
// ============================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// ============================
// GET ALL PAINTINGS
// ============================

router.get("/", async (req, res) => {
  try {
    const paintings = await Painting.find().sort({ createdAt: -1 });
    res.json(paintings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================
// ADD NEW PAINTING
// ============================

router.post("/add", upload.single("image"), async (req, res) => {
  try {

    const {
      title,
      description,
      price,
      stock,
      isFeatured,
      isHero,
      section
    } = req.body;

    const newPainting = new Painting({
      title,
      description,
      price: Number(price),
      stock: Number(stock),
      image: "/uploads/" + req.file.filename,
      likes: 0,
      isFeatured: isFeatured === "true",
      isHero: isHero === "true",
      section: section || "featured"
    });

    await newPainting.save();

    res.json({
      success: true,
      message: "Painting added successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


// ============================
// DELETE PAINTING
// ============================

router.delete("/delete/:id", async (req, res) => {
  try {
    await Painting.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Painting deleted"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


// ============================
// UPDATE PAINTING
// ============================

router.put("/update/:id", async (req, res) => {
  try {

    const updated = await Painting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      updated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
