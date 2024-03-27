const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/google/tenant",
  passport.authenticate("google-tenant", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google-tenant", {
    successRedirect: "/success", // Redirect to a success page
    failureRedirect: "/login", // Redirect to a login page on failure
  })
);

router.get(
  "/google/landlord",
  passport.authenticate("google-landlord", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback/landlord",
  passport.authenticate("google-landlord", {
    successRedirect: "/success", // Redirect to a success page
    failureRedirect: "/login", // Redirect to a login page on failure
  })
);

module.exports = router;
