const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  age: { type: Number },
  address: { type: String }, // Keep for backward compatibility
  country: { type: String },
  countryCode: { type: String },
  state: { type: String },
  city: { type: String },
  streetNumber: { type: String },
  streetName: { type: String },
  apartment: { type: String },
  postalCode: { type: String },
  neighborhood: { type: String },
  landmark: { type: String },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
    accuracy: { type: Number },
  },
  phoneCountryCode: { type: String, default: "+1" },
  phoneNumber: { type: String },
  contactInfo: { type: String }, // Keep for backward compatibility
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
