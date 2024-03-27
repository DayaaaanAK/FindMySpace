const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const TenantProfile = require("../models/TenantProfile");
const LandlordProfile = require("../models/LandlordProfile");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          return done(null, false, { message: "Incorrect email." });
        }

        const passwordMatch = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, existingUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "google-tenant",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback/",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOneAndUpdate(
          { email: profile.emails[0].value },
          { role: "tenant" },
          { new: true, upsert: true }
        );

        const newProfile = await TenantProfile.create({
          user: user._id,
          name: null,
          age: null,
          contactNumber: null,
        });
        console.log(newProfile);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "google-landlord",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback/landlord",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOneAndUpdate(
          { email: profile.emails[0].value },
          { role: "landlord" },
          { new: true, upsert: true }
        );

        const newProfile = await LandlordProfile.create({
          user: user._id,
          name: null,
          age: null,
          contactNumber: null,
        });
        console.log(newProfile);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById(_id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
