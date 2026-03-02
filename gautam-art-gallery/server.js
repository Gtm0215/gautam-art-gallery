require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const adminRoutes = require("./routes/admin");
const paintingRoutes = require("./routes/paintings");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

const app = express();

/* ===============================
   MIDDLEWARE
================================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   STATIC FOLDER
================================= */
app.use(express.static(path.join(__dirname, "public")));

/* ===============================
   DATABASE CONNECTION
================================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

/* ===============================
   ROUTES
================================= */
app.use("/api/admin", adminRoutes);
app.use("/api/paintings", paintingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

/* ===============================
   ROOT ROUTE
================================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ===============================
   START SERVER
================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
