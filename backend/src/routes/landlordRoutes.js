const express = require("express");
const router = express.Router();
const landlordController = require("../controller/landlordController");
const { authenticateUserRole } = require("../middleware/auth");

router.post("/signup", landlordController.signup);

router.post("/login", landlordController.login);

router.get(
  "/logout",
  authenticateUserRole("landlord"),
  landlordController.logout
);

router.get(
  "/profile",
  authenticateUserRole("landlord"),
  landlordController.getProfile
);

router.put(
  "/update-profile",
  authenticateUserRole("landlord"),
  landlordController.updateProfile
);

module.exports = router;
