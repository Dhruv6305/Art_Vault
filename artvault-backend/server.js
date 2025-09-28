const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
require("./config/passport"); // Import passport configuration

// Import models to register them with Mongoose
const User = require("./models/User");
const Artwork = require("./models/Artwork");
const Order = require("./models/Order");
const Notification = require("./models/Notification");

// Explicitly register models with mongoose
const mongoose = require("mongoose");
console.log("📋 Registering models...");
console.log(
  "User model:",
  mongoose.models.User ? "✅ Registered" : "❌ Not registered"
);
console.log(
  "Artwork model:",
  mongoose.models.Artwork ? "✅ Registered" : "❌ Not registered"
);
console.log(
  "Order model:",
  mongoose.models.Order ? "✅ Registered" : "❌ Not registered"
);
console.log(
  "Notification model:",
  mongoose.models.Notification ? "✅ Registered" : "❌ Not registered"
);

const app = express();

// Connect Database
connectDB();

// --- Middleware ---
// CORS: Allows the frontend to make requests to this backend
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// Body Parser: To accept JSON data in the body
app.use(express.json({ extended: false }));

// Express Session: Required for Passport
app.use(
  session({
    secret: "keyboard cat", // A secret key for signing the session ID cookie
    resave: false,
    saveUninitialized: true,
  })
);

// Passport Middleware: Initializes Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ArtVault API</title>
    </head>
    <body>
        <h1>🎨 ArtVault API Server</h1>
        <p>Backend server is running successfully!</p>
        <p>API endpoints are available at <code>/api/*</code></p>
    </body>
    </html>
  `);
});

// Test endpoint to check file serving
app.get("/test-files", (req, res) => {
  const fs = require("fs");
  const uploadsPath = path.join(__dirname, "src/uploads");

  try {
    const checkDirectory = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      const result = {};

      files.forEach((file) => {
        if (file.isDirectory()) {
          result[file.name] = checkDirectory(path.join(dir, file.name));
        } else {
          result[file.name] = {
            size: fs.statSync(path.join(dir, file.name)).size,
            url: `/uploads/${path
              .relative(uploadsPath, path.join(dir, file.name))
              .replace(/\\/g, "/")}`,
          };
        }
      });

      return result;
    };

    const structure = checkDirectory(uploadsPath);
    res.json({ success: true, structure });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/artworks", require("./routes/artwork"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/notifications", require("./routes/notifications"));

// Add logging middleware for file requests (before static serving)
app.use("/uploads", (req, res, next) => {
  console.log("File request:", req.url);
  const fullPath = path.join(__dirname, "src/uploads", req.url);
  console.log("Looking for file at:", fullPath);
  next();
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
