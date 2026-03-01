const express = require("express");
const multer = require("multer");
const path = require("path");
const Painting = require("../models/Painting");
const auth = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/add", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const painting = new Painting({
      title,
      description,
      price,
      image: "/uploads/" + req.file.filename
    });

    await painting.save();
    res.json({ message: "Painting added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding painting" });
  }
});

router.get("/", async (req, res) => {
  const paintings = await Painting.find();
  res.json(paintings);
});

router.post("/like/:id", async (req, res) => {
  await Painting.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
  res.json({ message: "Painting liked" });
});

module.exports = router;
