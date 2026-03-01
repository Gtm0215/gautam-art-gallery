require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const Painting = require("./models/Painting");
const Contact = require("./models/Contact");

app.get("/api/paintings", async (req, res) => {
    const data = await Painting.find();
    res.json(data);
});

app.post("/api/like/:id", async (req, res) => {
    const painting = await Painting.findById(req.params.id);
    painting.likes += 1;
    await painting.save();
    res.json(painting);
});

app.post("/api/dislike/:id", async (req, res) => {
    const painting = await Painting.findById(req.params.id);
    painting.dislikes += 1;
    await painting.save();
    res.json(painting);
});

app.post("/api/contact", async (req, res) => {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.json({ message: "Message sent successfully!" });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
});