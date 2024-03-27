const express = require("express");
const router = express.Router();
const { authenticateUserRole } = require("../middleware/auth");
const {
  applyForProperty,
  getPropertyApplications,
  updateApplicationStatus,
} = require("../controller/applicationController");

router.post(
  "/:propertyId/apply",
  authenticateUserRole("tenant"),
  applyForProperty
);

router.get(
  "/:propertyId/applications",
  authenticateUserRole("landlord"),
  getPropertyApplications
);

router.put(
  "/:applicationId/status",
  authenticateUserRole("landlord"),
  updateApplicationStatus
);

module.exports = router;
