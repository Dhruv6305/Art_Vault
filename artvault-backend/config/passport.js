const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
require("dotenv").config();

// Only configure Google OAuth if credentials are provided and valid
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID.includes(".apps.googleusercontent.com") &&
  process.env.GOOGLE_CLIENT_SECRET.startsWith("GOCSPX-")
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback", // This must match the one in Google Cloud Console
      },
      async (accessToken, refreshToken, profile, done) => {
        // This function is called after a user successfully authenticates with Google
        const googleEmail = profile.emails[0].value;
        const googleId = profile.id;
        const displayName = profile.displayName;

        try {
          console.log(`Google OAuth attempt for: ${googleEmail}`);

          // First, check if user exists with this Google ID
          let user = await User.findOne({ googleId: googleId });

          if (user) {
            console.log(`Found existing user with Google ID: ${user.email}`);
            return done(null, user);
          }

          // If no Google ID match, check if user exists with this email
          user = await User.findOne({ email: googleEmail });

          if (user) {
            // User exists with this email but no Google ID - link the accounts
            console.log(
              `Linking existing email account with Google: ${googleEmail}`
            );
            user.googleId = googleId;
            user.name = user.name || displayName; // Keep existing name if available
            await user.save();
            return done(null, user);
          }

          // No existing user found - create new user
          console.log(`Creating new user for Google login: ${googleEmail}`);
          const newUser = {
            googleId: googleId,
            name: displayName,
            email: googleEmail,
          };

          user = await User.create(newUser);
          console.log(`New user created successfully: ${user._id}`);
          return done(null, user);
        } catch (err) {
          console.error("Google OAuth error:", err);
          return done(err, null);
        }
      }
    )
  );

  // Stores the user ID in the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Retrieves the user details from the database using the ID from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
} else {
  console.log(
    "Google OAuth credentials not configured. Google sign-in will be disabled."
  );
}
