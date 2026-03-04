const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Painting = require("../models/Painting");


/* =============================
   MULTER STORAGE CONFIG
============================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


/* =============================
   GET ALL PAINTINGS
============================= */

router.get("/", async (req, res) => {
  try {

    const paintings = await Painting.find().sort({ createdAt: -1 });

    res.json(paintings);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
});
router.get("/featured", async (req,res)=>{

const products = await Painting.find({isFeatured:true})

res.json(products)

})

/* =============================
   GET HERO PAINTING
============================= */

router.get("/hero", async (req, res) => {
  try {

    const hero = await Painting.findOne({ isHero: true });

    res.json(hero);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
});


/* =============================
   ADD NEW PAINTING
============================= */

router.post("/", upload.single("image"), async (req, res) => {
  try {
const { title, description, price, stock, isFeatured } = req.body;
const heroValue = req.body.isHero === "true";
    const { title, description, price, stock, isHero } = req.body;

    let heroValue = false;

    if (isHero === "true") {

      heroValue = true;

      // Remove previous hero
     await Painting.updateMany({}, { isHero: false });
}

const newPainting = new Painting({
 title,
 description,
 price,
 stock,
 image: "/uploads/" + req.file.filename,
 isHero: heroValue,
 isFeatured: isFeatured === "true"
});

await newPainting.save();

res.json({ message: "Painting added successfully" });

} catch (error) {
 res.status(500).json({ error: error.message });
}
});
/* =============================
   DELETE PAINTING
============================= */

router.delete("/:id", async (req, res) => {
  try {

    await Painting.findByIdAndDelete(req.params.id);

    res.json({ message: "Painting deleted" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
});


module.exports = router;
