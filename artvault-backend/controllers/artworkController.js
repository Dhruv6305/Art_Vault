const Artwork = require("../models/Artwork");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// Create new artwork
exports.createArtwork = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      artworkType,
      medium,
      dimensions,
      price,
      quantity,
      tags,
      yearCreated,
      style,
      technique,
      location,
      shipping,
      files,
    } = req.body;

    // Get artist information
    const artist = await User.findById(req.user.id).select("name");
    if (!artist) {
      return res.status(404).json({ success: false, msg: "Artist not found" });
    }

    const artwork = new Artwork({
      title,
      description,
      category,
      subcategory,
      artworkType,
      medium,
      dimensions,
      price,
      quantity: quantity || 1,
      artist: req.user.id,
      artistName: artist.name,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      yearCreated,
      style,
      technique,
      location,
      shipping,
      files: files || [],
    });

    await artwork.save();

    res.json({
      success: true,
      artwork,
      msg: "Artwork created successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// Get all artworks with filtering and pagination
exports.getArtworks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      availability = "available",
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    // Build filter object
    const filter = { availability };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter["price.amount"] = {};
      if (minPrice) filter["price.amount"].$gte = parseFloat(minPrice);
      if (maxPrice) filter["price.amount"].$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
        { artistName: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const artworks = await Artwork.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("artist", "name email");

    const total = await Artwork.countDocuments(filter);

    res.json({
      success: true,
      artworks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// Get single artwork by ID
exports.getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate(
      "artist",
      "name email createdAt"
    );

    if (!artwork) {
      return res.status(404).json({ success: false, msg: "Artwork not found" });
    }

    // Increment view count
    artwork.views += 1;
    await artwork.save();

    res.json({ success: true, artwork });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ success: false, msg: "Artwork not found" });
    }
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// Update artwork
exports.updateArtwork = async (req, res) => {
  try {
    let artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ success: false, msg: "Artwork not found" });
    }

    // Check if user owns the artwork
    if (artwork.artist.toString() !== req.user.id) {
      return res.status(401).json({ success: false, msg: "Not authorized" });
    }

    // Process tags if provided
    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = req.body.tags.split(",").map((tag) => tag.trim());
    }

    artwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({ success: true, artwork });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// Delete artwork
exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ success: false, msg: "Artwork not found" });
    }

    // Check if user owns the artwork
    if (artwork.artist.toString() !== req.user.id) {
      return res.status(401).json({ success: false, msg: "Not authorized" });
    }

    // Delete associated files
    artwork.files.forEach((file) => {
      const filePath = path.join(__dirname, "..", file.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Artwork.findByIdAndDelete(req.params.id);

    res.json({ success: true, msg: "Artwork deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// Get user's artworks
exports.getUserArtworks = async (req, res) => {
  console.log("=== GET USER ARTWORKS ===");
  console.log("User ID from params:", req.params.userId);
  console.log("Query params:", req.query);

  try {
    const userId = req.params.userId;

    // Validate user ID
    if (!userId || userId === "undefined") {
      console.log("Invalid user ID provided");
      return res.status(400).json({
        success: false,
        msg: "Invalid user ID provided",
      });
    }

    const {
      page = 1,
      limit = 12,
      availability,
      sortBy = "createdAt",
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = { artist: userId };
    if (availability && availability !== "all") {
      filter.availability = availability;
    }

    console.log("Filter:", filter);
    console.log("Sort by:", sortBy);

    const artworks = await Artwork.find(filter)
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Artwork.countDocuments(filter);

    console.log("Found artworks:", artworks.length);
    console.log("Total count:", total);

    res.json({
      success: true,
      artworks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("getUserArtworks error:", err);
    res
      .status(500)
      .json({ success: false, msg: "Server Error", error: err.message });
  }
};

// Like/Unlike artwork
exports.likeArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ success: false, msg: "Artwork not found" });
    }

    // Check if already liked
    const likeIndex = artwork.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike
      artwork.likes.splice(likeIndex, 1);
    } else {
      // Like
      artwork.likes.push({ user: req.user.id });
    }

    await artwork.save();

    res.json({
      success: true,
      liked: likeIndex === -1,
      likesCount: artwork.likes.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// Handle file uploads
exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, msg: "No files uploaded" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const files = req.files.map((file) => {
      // Convert file path to URL format
      const relativePath = file.path.replace(/\\/g, "/").replace("src/", "");
      console.log("File path:", file.path, "-> Relative path:", relativePath);

      return {
        type: file.mimetype.startsWith("image/")
          ? "image"
          : file.mimetype.startsWith("video/")
          ? "video"
          : file.mimetype.startsWith("audio/")
          ? "audio"
          : "document",
        url: relativePath, // Store relative path without base URL
        localPath: file.path,
        filename: file.originalname,
        savedAs: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      };
    });

    console.log(
      "Files uploaded successfully:",
      files.map((f) => ({ filename: f.filename, url: f.url }))
    );

    res.json({ success: true, files });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// Handle folder uploads
exports.uploadFolder = async (req, res) => {
  console.log("=== FOLDER UPLOAD START ===");
  console.log("User:", req.user?.id);
  console.log("Files received:", req.files?.length || 0);
  console.log("Body:", req.body);

  try {
    if (!req.files || req.files.length === 0) {
      console.log("No files in request");
      return res.status(400).json({ success: false, msg: "No files uploaded" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const folderName = req.body.folderName || `folder_${Date.now()}`;

    console.log("Processing folder:", folderName);
    console.log("Base URL:", baseUrl);

    let totalSize = 0;
    const processedFiles = [];

    // For folder uploads, we'll keep files in the temp location and just track them
    for (const file of req.files) {
      console.log("Processing file:", file.originalname, "Size:", file.size);

      totalSize += file.size;

      // Use the file path as provided by multer
      const relativePath = file.path.replace(/\\/g, "/").replace("src/", "");
      console.log(
        "Folder file path:",
        file.path,
        "-> Relative path:",
        relativePath
      );

      processedFiles.push({
        type: file.mimetype.startsWith("image/")
          ? "image"
          : file.mimetype.startsWith("video/")
          ? "video"
          : file.mimetype.startsWith("audio/")
          ? "audio"
          : "document",
        url: relativePath, // Store relative path without base URL
        filename: file.originalname,
        originalPath: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      });
    }

    const folderInfo = {
      folderPath: `uploads/folders/${folderName}`,
      totalFiles: processedFiles.length,
      folderSize: totalSize,
      files: processedFiles,
    };

    console.log(
      `Folder uploaded successfully: ${folderName} with ${processedFiles.length} files`
    );

    res.json({
      success: true,
      folder: folderInfo,
      message: `Folder uploaded with ${processedFiles.length} files`,
    });
  } catch (err) {
    console.error("Folder upload error:", err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// Create artwork from folder
exports.createArtworkFromFolder = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      artworkType,
      medium,
      dimensions,
      price,
      quantity,
      tags,
      yearCreated,
      style,
      technique,
      location,
      shipping,
      folderData,
    } = req.body;

    // Get artist information
    const artist = await User.findById(req.user.id).select("name");
    if (!artist) {
      return res.status(404).json({ success: false, msg: "Artist not found" });
    }

    const artwork = new Artwork({
      title,
      description,
      category,
      subcategory,
      artworkType,
      medium,
      dimensions,
      price,
      quantity: quantity || 1,
      artist: req.user.id,
      artistName: artist.name,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      yearCreated,
      style,
      technique,
      location,
      shipping,
      files: folderData.files || [],
      folderStructure: {
        isFolder: true,
        folderPath: folderData.folderPath,
        totalFiles: folderData.totalFiles,
        folderSize: folderData.folderSize,
      },
    });

    await artwork.save();

    res.json({
      success: true,
      artwork,
      msg: "Artwork created successfully from folder",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};
