const express = require("express");
const router = express.Router();
const multer = require("multer");
const Painting = require("../models/Painting");
const authMiddleware = require("../middleware/auth");

/* IMAGE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* GET ALL PAINTINGS */
router.get("/", async (req, res) => {
  const paintings = await Painting.find();
  res.json(paintings);
});

/* ADD PAINTING (ADMIN ONLY) */
router.post("/add", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

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
    res.status(500).json({ message: "Server error" });
  }
});

/* EDIT PAINTING */
router.put("/edit/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

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

/* DELETE PAINTING */
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    await Painting.findByIdAndDelete(req.params.id);
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* LIKE PAINTING */
router.post("/like/:id", async (req, res) => {
  const painting = await Painting.findById(req.params.id);
  painting.likes += 1;
  await painting.save();
  res.json({ success: true });
});

module.exports = router;
