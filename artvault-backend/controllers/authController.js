const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    age,
    address,
    country,
    state,
    phoneCountryCode,
    phoneNumber,
    contactInfo,
  } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({
      name,
      email,
      password,
      age,
      address,
      country,
      state,
      phoneCountryCode: phoneCountryCode || "+1",
      phoneNumber,
      contactInfo,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });
    if (!user.password)
      return res.status(400).json({ msg: "Please sign in with Google." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateProfile = async (req, res) => {
  const {
    name,
    email,
    age,
    address,
    country,
    countryCode,
    state,
    city,
    streetNumber,
    streetName,
    apartment,
    postalCode,
    neighborhood,
    landmark,
    coordinates,
    phoneCountryCode,
    phoneNumber,
    contactInfo,
  } = req.body;

  try {
    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, msg: "Email already exists" });
      }
    }

    // Build profile object
    const profileFields = {};
    if (name !== undefined) profileFields.name = name;
    if (email !== undefined) profileFields.email = email;
    if (age !== undefined) profileFields.age = age;
    if (address !== undefined) profileFields.address = address;
    if (country !== undefined) profileFields.country = country;
    if (countryCode !== undefined) profileFields.countryCode = countryCode;
    if (state !== undefined) profileFields.state = state;
    if (city !== undefined) profileFields.city = city;
    if (streetNumber !== undefined) profileFields.streetNumber = streetNumber;
    if (streetName !== undefined) profileFields.streetName = streetName;
    if (apartment !== undefined) profileFields.apartment = apartment;
    if (postalCode !== undefined) profileFields.postalCode = postalCode;
    if (neighborhood !== undefined) profileFields.neighborhood = neighborhood;
    if (landmark !== undefined) profileFields.landmark = landmark;
    if (coordinates !== undefined) profileFields.coordinates = coordinates;
    if (phoneCountryCode !== undefined)
      profileFields.phoneCountryCode = phoneCountryCode;
    if (phoneNumber !== undefined) profileFields.phoneNumber = phoneNumber;
    if (contactInfo !== undefined) profileFields.contactInfo = contactInfo;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};
