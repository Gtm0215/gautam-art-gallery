const express = require("express");
const router = express.Router();
const multer = require("multer");
const Category = require("../models/Category");
const path = require("path");


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


// ================= GET ALL =================

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ position: 1 });
  res.json(categories);
});


// ================= ADD CATEGORY =================

router.post("/", upload.single("image"), async (req, res) => {
  const { name, position } = req.body;

  const newCategory = new Category({
    name,
    position,
    image: "/uploads/" + req.file.filename
  });

  await newCategory.save();
  res.json({ message: "Category Added" });
});


// ================= UPDATE CATEGORY =================

router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, position } = req.body;

  const updateData = {
    name,
    position
  };

  if (req.file) {
    updateData.image = "/uploads/" + req.file.filename;
  }

  await Category.findByIdAndUpdate(req.params.id, updateData);
  res.json({ message: "Category Updated" });
});


// ================= DELETE CATEGORY =================

router.delete("/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category Deleted" });
});


module.exports = router;
