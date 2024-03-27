const express = require("express");
const router = express.Router();
const tenantController = require("../controller/tenantController");
const { authenticateUserRole } = require("../middleware/auth");

router.post("/signup", tenantController.signup);

router.post("/login", tenantController.login);

router.get("/logout", authenticateUserRole("tenant"), tenantController.logout);

router.get(
  "/profile",
  authenticateUserRole("tenant"),
  tenantController.getProfile
);

router.put(
  "/update-profile",
  authenticateUserRole("tenant"),
  tenantController.updateProfile
);

module.exports = router;
