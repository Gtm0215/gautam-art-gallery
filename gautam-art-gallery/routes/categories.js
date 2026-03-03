const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Category = require("../models/Category");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ position: 1 });
  res.json(categories);
});


// UPDATE CATEGORY IMAGE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, {
      image: "/uploads/" + req.file.filename
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
