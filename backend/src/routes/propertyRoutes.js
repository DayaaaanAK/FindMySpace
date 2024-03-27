const express = require("express");
const router = express.Router();
const { authenticateUserRole } = require("../middleware/auth");
const { uploadImage, uploadVideo } = require("../middleware/file");
const propertyController = require("../controller/propertyController");

router.post(
  "/create",
  authenticateUserRole("landlord"),
  propertyController.createProperty
);

router.get("/list", propertyController.getAllProperties);

router.get("/search", propertyController.searchProperties);

router.get(
  "/owned",
  authenticateUserRole("landlord"),
  propertyController.getOwnedProperties
);

router.get("/:propertyId", propertyController.getPropertyDetails);

router.put(
  "/:propertyId",
  authenticateUserRole("landlord"),
  propertyController.updateProperty
);

router.put(
  "/:propertyId/images",
  authenticateUserRole("landlord"),
  uploadImage.array("images", 5),
  propertyController.addImagesToProperty
);

router.put(
  "/:propertyId/videos",
  authenticateUserRole("landlord"),
  uploadVideo.array("videos", 5),
  propertyController.addVideosToProperty
);

router.delete(
  "/:propertyId",
  authenticateUserRole("landlord"),
  propertyController.deleteProperty
);

module.exports = router;
