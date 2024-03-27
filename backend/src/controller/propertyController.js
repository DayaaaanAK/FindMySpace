const Property = require("../models/Property");
const LandlordProfile = require("../models/LandlordProfile");

const createProperty = async (req, res) => {
  try {
    const { address, description, rentPrice, location } = req.body;

    const landlordId = req.user._id;

    const newProperty = await Property.create({
      address,
      description,
      rentPrice,
      location,
      owner: landlordId,
    });

    await LandlordProfile.findOneAndUpdate(
      { user: landlordId },
      { $push: { propertiesOwned: newProperty._id } },
      { new: true }
    );

    res.status(201).json({
      property: newProperty,
      message: "Property created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({ properties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const searchProperties = async (req, res) => {
  try {
    const { location, maxPrice } = req.query;

    const query = {};
    if (location) query.location = location;
    if (maxPrice) query.rentPrice = { $lte: maxPrice };

    const properties = await Property.find(query);
    res.status(200).json({ properties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getOwnedProperties = async (req, res) => {
  try {
    const landlordId = req.user._id;
    const properties = await Property.find({ owner: landlordId });
    res.status(200).json({ properties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getPropertyDetails = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }
    res.status(200).json({ property });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const updatedDetails = req.body;

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      updatedDetails,
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found." });
    }

    res.status(200).json({ property: updatedProperty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const deletedProperty = await Property.findByIdAndDelete(propertyId);

    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found." });
    }

    res.status(200).json({ message: "Property deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const addImagesToProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Permission denied." });
    }

    const imageFilenames = req.files.map((file) => file.filename);

    property.images = property.images.concat(imageFilenames);

    await property.save();

    res.status(200).json({ message: "Images added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const addVideosToProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Permission denied." });
    }

    const videoFilenames = req.files.map((file) => file.filename);

    property.videos = property.videos.concat(videoFilenames);

    await property.save();

    res.status(200).json({ message: "Videos added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  searchProperties,
  getOwnedProperties,
  getPropertyDetails,
  updateProperty,
  deleteProperty,
  addImagesToProperty,
  addVideosToProperty,
};
