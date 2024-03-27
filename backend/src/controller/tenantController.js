const passport = require("passport");
const bcrypt = require("bcrypt");
const TenantProfile = require("../models/TenantProfile");
const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { email, password, name, age, contactNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "tenant",
    });
    console.log(newUser);

    const newProfile = await TenantProfile.create({
      user: newUser._id,
      name,
      age,
      contactNumber,
    });
    console.log(newProfile);

    return res.status(201).json({ message: "Tenant signup successful." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const login = (req, res, next) => {
  const strategyName = "local";
  passport.authenticate(strategyName, (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error." });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error." });
      }
      console.log(user);
      return res.status(200).json({ message: "Login successful." });
    });
  })(req, res, next);
};

const logout = (req, res) => {
  console.log(req.user._id);
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out" });
  });
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateFields = req.body;

    const existingProfile = await TenantProfile.findOne({ user: userId });

    if (!existingProfile) {
      return res.status(404).json({ message: "Tenant profile not found." });
    }

    const updatedProfile = await TenantProfile.findByIdAndUpdate(
      existingProfile._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Tenant profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await TenantProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, logout, updateProfile, getProfile };
