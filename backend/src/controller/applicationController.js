const Application = require("../models/Application");
const Property = require("../models/Property");
const TenantProfile = require("../models/TenantProfile");

const applyForProperty = async (req, res) => {
  try {
    const { message } = req.body;
    const tenantId = req.user._id;
    const propertyId = req.params.propertyId;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const existingApplication = await Application.findOne({
      propertyId: propertyId,
      tenantId: tenantId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "Application already submitted." });
    }

    const newApplication = await Application.create({
      propertyId: propertyId,
      tenantId: tenantId,
      message,
      status: "pending",
    });

    res.status(201).json({
      application: newApplication,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getPropertyApplications = async (req, res) => {
  try {
    const landlordId = req.user._id;
    const propertyId = req.params.propertyId;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    if (property.owner.toString() !== landlordId.toString()) {
      return res.status(403).json({ message: "Permission denied." });
    }

    const applications = await Application.find({ propertyId: propertyId });

    res.status(200).json({ applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (status === "approved") {
      const tenantProfile = await TenantProfile.findOne({
        user: application.tenantId,
      });

      if (!tenantProfile) {
        return res.status(404).json({ message: "Tenant profile not found." });
      }

      tenantProfile.currentResidence = application.propertyId;

      tenantProfile.rentalHistory.push(application.propertyId);
      await tenantProfile.save();
    }

    application.status = status;
    await application.save();

    res
      .status(200)
      .json({ message: "Application status updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  applyForProperty,
  getPropertyApplications,
  updateApplicationStatus,
};
