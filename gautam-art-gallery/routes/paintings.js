const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Painting = require("../models/Painting");

// ================= UPLOAD CONFIG =================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ================= GET ALL PAINTINGS =================

router.get("/", async (req, res) => {
  const paintings = await Painting.find().sort({ createdAt: -1 });
  res.json(paintings);
});

// ================= ADD PAINTING =================

const express = require("express");
const router = express.Router();
const multer = require("multer");
const Painting = require("../models/Painting");

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ ADD PAINTING
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, stock, isHero } = req.body;

    // ✅ If new hero selected → remove old hero
    if (isHero === "true") {
      await Painting.updateMany({}, { isHero: false });
    }

    const newPainting = new Painting({
      title,
      description,
      price,
      stock,
      image: "/uploads/" + req.file.filename,
      isHero: isHero === "true"
    });

    await newPainting.save();

    res.json({ message: "Painting added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL
router.get("/", async (req, res) => {
  const paintings = await Painting.find();
  res.json(paintings);
});

module.exports = router;
    // Convert checkbox properly
    const isHeroSelected = req.body.isHero === "true";

    // 🔥 If hero selected → remove ALL old heroes first
    if (isHeroSelected) {
      await Painting.updateMany({ isHero: true }, { isHero: false });
    }

    const newPainting = new Painting({
      title,
      description,
      price,
      stock,
      image: "/uploads/" + req.file.filename,
      isHero: isHeroSelected
    });

    await newPainting.save();

    res.json({ success: true, message: "Painting Added" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});
  // If new hero selected → remove old hero
  if (isHero === "true") {
    await Painting.updateMany({}, { isHero: false });
  }

  const newPainting = new Painting({
    title,
    description,
    price,
    stock,
    image: "/uploads/" + req.file.filename,
    isHero: isHero === "true"
  });

  await newPainting.save();
  res.json({ message: "Painting Added Successfully" });
});

// ================= DELETE PAINTING =================

router.delete("/:id", async (req, res) => {
  await Painting.findByIdAndDelete(req.params.id);
  res.json({ message: "Painting Deleted" });
});

module.exports = router;
