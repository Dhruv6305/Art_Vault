const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();

// Only configure Google OAuth if credentials are provided and valid
if (process.env.GOOGLE_CLIENT_ID && 
    process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com') &&
    process.env.GOOGLE_CLIENT_SECRET.startsWith('GOCSPX-')) {
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback', // This must match the one in Google Cloud Console
      },
      async (accessToken, refreshToken, profile, done) => {
        // This function is called after a user successfully authenticates with Google
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        try {
          // Check if the user already exists in your database
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // If user exists, proceed
            done(null, user);
          } else {
            // If not, create a new user in your database
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
          done(err, null);
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
  console.log('Google OAuth credentials not configured. Google sign-in will be disabled.');
}