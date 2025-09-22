const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
require("./config/passport"); // Import passport configuration

const app = express();

// Connect Database
connectDB();

// --- Middleware ---
// CORS: Allows the frontend to make requests to this backend
app.use(
  cors({
    origin: process.env.CLIENT_URL,
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
app.get("/", (req, res) => res.send("ArtVault API is running..."));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/artworks", require("./routes/artwork"));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
