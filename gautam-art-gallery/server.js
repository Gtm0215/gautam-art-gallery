const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;


// ============================
// MIDDLEWARE
// ============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve public folder
app.use(express.static("public"));

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


// ============================
// DATABASE CONNECTION
// ============================

mongoose.connect(process.env.MONGO_URI || "YOUR_MONGODB_CONNECTION_STRING")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// ============================
// ROUTES
// ============================

const paintingRoutes = require("./routes/paintings");
const categoryRoutes = require("./routes/categories");

app.use("/api/paintings", paintingRoutes);
app.use("/api/categories", categoryRoutes);


// ============================
// DEFAULT ROUTE
// ============================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});


// ============================
// START SERVER
// ============================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
