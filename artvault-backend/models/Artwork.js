const mongoose = require("mongoose");

const ArtworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "visual_art",
      "music",
      "video",
      "digital_art",
      "photography",
      "sculpture",
      "other",
    ],
  },
  subcategory: {
    type: String,
    required: true,
  },
  artworkType: {
    type: String,
    required: true,
    enum: ["original", "print", "digital", "nft", "license"],
  },
  medium: {
    type: String,
    required: true,
  },
  dimensions: {
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number },
    unit: { type: String, enum: ["cm", "in", "mm"], default: "cm" },
  },
  // File information
  files: [
    {
      type: {
        type: String,
        enum: ["image", "video", "audio", "document"],
        required: true,
      },
      url: { type: String, required: true },
      filename: { type: String, required: true },
      originalPath: { type: String }, // Original folder path for bulk uploads
      size: { type: Number }, // in bytes
      duration: { type: Number }, // for audio/video in seconds
      isPrimary: { type: Boolean, default: false },
    },
  ],
  // Folder structure for bulk uploads
  folderStructure: {
    isFolder: { type: Boolean, default: false },
    folderPath: { type: String }, // Base folder path in uploads
    totalFiles: { type: Number, default: 0 },
    folderSize: { type: Number, default: 0 }, // Total size in bytes
  },
  // Pricing
  price: {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    negotiable: { type: Boolean, default: false },
  },
  // Availability
  availability: {
    type: String,
    enum: ["available", "sold", "reserved", "draft"],
    default: "draft",
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0,
  },
  // Artist/Seller information
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  artistName: { type: String, required: true },
  // Metadata
  tags: [{ type: String, trim: true }],
  yearCreated: { type: Number },
  style: { type: String },
  technique: { type: String },
  // Shipping & Location
  location: {
    city: String,
    state: String,
    country: String,
  },
  shipping: {
    available: { type: Boolean, default: true },
    cost: { type: Number, default: 0 },
    methods: [{ type: String }],
  },
  // Engagement
  views: { type: Number, default: 0 },
  likes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
    },
  ],
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
ArtworkSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better performance
ArtworkSchema.index({ artist: 1, createdAt: -1 });
ArtworkSchema.index({ category: 1, availability: 1 });
ArtworkSchema.index({ "price.amount": 1 });
ArtworkSchema.index({ tags: 1 });

module.exports = mongoose.model("Artwork", ArtworkSchema);
