const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Standard JWT Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);

// Google OAuth Authentication (only if configured)
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID.includes(".apps.googleusercontent.com") &&
  process.env.GOOGLE_CLIENT_SECRET.startsWith("GOCSPX-")
) {
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    }),
    (req, res) => {
      try {
        console.log(
          "Google OAuth callback successful for user:",
          req.user.email
        );
        const payload = { user: { id: req.user.id } };
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: "5d" },
          (err, token) => {
            if (err) {
              console.error("JWT signing error:", err);
              return res.redirect(
                `${process.env.CLIENT_URL}/login?error=token_error`
              );
            }
            console.log("Redirecting to success page with token");
            res.redirect(
              `${process.env.CLIENT_URL}/auth/success?token=${token}`
            );
          }
        );
      } catch (error) {
        console.error("Google OAuth callback error:", error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=callback_error`);
      }
    }
  );
} else {
  // Fallback routes when Google OAuth is not configured
  router.get("/google", (req, res) => {
    res.status(501).json({ msg: "Google OAuth not configured" });
  });
}

module.exports = router;
