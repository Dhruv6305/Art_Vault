const mongoose = require("mongoose");
const Artwork = require("./models/Artwork");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const createDigitalArtworks = async () => {
  try {
    await connectDB();

    console.log(
      "Adding digital artworks and videos with correct dimensions..."
    );

    const digitalArtworks = [
      // Digital Art (using cm for prints)
      {
        title: "Neon Dreams",
        description:
          "Retro-futuristic digital art with vibrant neon aesthetics",
        artistName: "Kai Nakamura",
        artist: new mongoose.Types.ObjectId(),
        category: "digital_art",
        subcategory: "Retro-Futurism",
        artworkType: "digital",
        medium: "Digital Illustration",
        yearCreated: 2024,
        dimensions: {
          width: 60,
          height: 40,
          unit: "cm",
        },
        price: {
          amount: 1600,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 3,
        tags: ["neon", "retro", "futuristic", "synthwave"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
            filename: "neon_dreams.jpg",
            size: 2560000,
            isPrimary: true,
          },
        ],
        views: 456,
        likes: [],
      },
      {
        title: "Space Explorer",
        description:
          "Sci-fi digital artwork depicting a lone astronaut exploring alien worlds",
        artistName: "Nova Studios",
        artist: new mongoose.Types.ObjectId(),
        category: "digital_art",
        subcategory: "Sci-Fi",
        artworkType: "digital",
        medium: "Digital Painting",
        yearCreated: 2024,
        dimensions: {
          width: 80,
          height: 60,
          unit: "cm",
        },
        price: {
          amount: 1800,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 2,
        tags: ["space", "astronaut", "sci-fi", "exploration"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop",
            filename: "space_explorer.jpg",
            size: 3072000,
            isPrimary: true,
          },
        ],
        views: 378,
        likes: [],
      },
      {
        title: "Digital Portrait",
        description:
          "Hyperrealistic digital portrait showcasing advanced digital painting techniques",
        artistName: "Aria Kim",
        artist: new mongoose.Types.ObjectId(),
        category: "digital_art",
        subcategory: "Portrait",
        artworkType: "digital",
        medium: "Digital Painting",
        yearCreated: 2024,
        dimensions: {
          width: 40,
          height: 50,
          unit: "cm",
        },
        price: {
          amount: 2200,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 1,
        tags: ["portrait", "realistic", "digital painting", "face"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
            filename: "digital_portrait.jpg",
            size: 1920000,
            isPrimary: true,
          },
        ],
        views: 267,
        likes: [],
      },
      {
        title: "Cyberpunk City",
        description:
          "Futuristic cityscape with neon lights and flying vehicles",
        artistName: "Digital Visions",
        artist: new mongoose.Types.ObjectId(),
        category: "digital_art",
        subcategory: "Cyberpunk",
        artworkType: "digital",
        medium: "Digital Art",
        yearCreated: 2024,
        dimensions: {
          width: 100,
          height: 70,
          unit: "cm",
        },
        price: {
          amount: 2000,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 5,
        tags: ["cyberpunk", "futuristic", "neon", "city"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
            filename: "cyberpunk_city.jpg",
            size: 2304000,
            isPrimary: true,
          },
        ],
        views: 342,
        likes: [],
      },

      // Video Art (no dimensions needed for video)
      {
        title: "Urban Poetry",
        description:
          "Cinematic short film exploring the rhythm and poetry of city life",
        artistName: "Metro Films",
        artist: new mongoose.Types.ObjectId(),
        category: "video",
        subcategory: "Short Film",
        artworkType: "digital",
        medium: "Digital Video",
        yearCreated: 2024,
        price: {
          amount: 2500,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 10,
        tags: ["urban", "cinematic", "poetry", "city"],
        files: [
          {
            type: "video",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            filename: "urban_poetry.mp4",
            size: 15728640,
            isPrimary: true,
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop",
            filename: "urban_poetry_thumb.jpg",
            size: 1024000,
            isPrimary: false,
          },
        ],
        views: 156,
        likes: [],
      },
      {
        title: "Nature Documentary",
        description:
          "Stunning wildlife documentary showcasing the beauty of natural habitats",
        artistName: "Wild Earth Productions",
        artist: new mongoose.Types.ObjectId(),
        category: "video",
        subcategory: "Documentary",
        artworkType: "digital",
        medium: "Digital Video",
        yearCreated: 2023,
        price: {
          amount: 3500,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 5,
        tags: ["nature", "wildlife", "documentary", "4k"],
        files: [
          {
            type: "video",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            filename: "nature_documentary.mp4",
            size: 52428800,
            isPrimary: true,
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1551522435-a13afa10f103?w=800&h=600&fit=crop",
            filename: "nature_doc_thumb.jpg",
            size: 1536000,
            isPrimary: false,
          },
        ],
        views: 298,
        likes: [],
      },
      {
        title: "Abstract Animation",
        description:
          "Mesmerizing abstract animation with flowing colors and shapes",
        artistName: "Motion Graphics Studio",
        artist: new mongoose.Types.ObjectId(),
        category: "video",
        subcategory: "Animation",
        artworkType: "digital",
        medium: "Digital Animation",
        yearCreated: 2024,
        price: {
          amount: 1800,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 15,
        tags: ["abstract", "animation", "colorful", "motion"],
        files: [
          {
            type: "video",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            filename: "abstract_animation.mp4",
            size: 8388608,
            isPrimary: true,
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
            filename: "abstract_anim_thumb.jpg",
            size: 768000,
            isPrimary: false,
          },
        ],
        views: 189,
        likes: [],
      },

      // More Visual Art varieties
      {
        title: "Portrait Study",
        description:
          "Classical portrait study in charcoal showcasing traditional techniques",
        artistName: "Catherine Moore",
        artist: new mongoose.Types.ObjectId(),
        category: "visual_art",
        subcategory: "Portrait",
        artworkType: "original",
        medium: "Charcoal on Paper",
        yearCreated: 2024,
        dimensions: {
          width: 40,
          height: 50,
          unit: "cm",
        },
        price: {
          amount: 1500,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 1,
        tags: ["portrait", "charcoal", "classical", "study"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
            filename: "portrait_study.jpg",
            size: 1536000,
            isPrimary: true,
          },
        ],
        views: 98,
        likes: [],
      },
      {
        title: "Geometric Abstraction",
        description:
          "Bold geometric composition exploring color relationships and form",
        artistName: "Alex Rivera",
        artist: new mongoose.Types.ObjectId(),
        category: "visual_art",
        subcategory: "Abstract",
        artworkType: "original",
        medium: "Acrylic on Canvas",
        yearCreated: 2024,
        dimensions: {
          width: 90,
          height: 90,
          unit: "cm",
        },
        price: {
          amount: 2600,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 1,
        tags: ["geometric", "abstract", "colorful", "modern"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
            filename: "geometric_abstraction.jpg",
            size: 1792000,
            isPrimary: true,
          },
        ],
        views: 156,
        likes: [],
      },

      // More Photography
      {
        title: "Street Photography",
        description:
          "Candid moments captured in the bustling streets of Mumbai",
        artistName: "Priya Sharma",
        artist: new mongoose.Types.ObjectId(),
        category: "photography",
        subcategory: "Street",
        artworkType: "print",
        medium: "Digital Photography",
        yearCreated: 2024,
        dimensions: {
          width: 70,
          height: 50,
          unit: "cm",
        },
        price: {
          amount: 1100,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 10,
        tags: ["street", "mumbai", "candid", "urban"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop",
            filename: "street_photography.jpg",
            size: 1664000,
            isPrimary: true,
          },
        ],
        views: 223,
        likes: [],
      },
      {
        title: "Minimalist Landscape",
        description:
          "Serene minimalist landscape focusing on negative space and composition",
        artistName: "David Kim",
        artist: new mongoose.Types.ObjectId(),
        category: "photography",
        subcategory: "Landscape",
        artworkType: "print",
        medium: "Digital Photography",
        yearCreated: 2024,
        dimensions: {
          width: 120,
          height: 80,
          unit: "cm",
        },
        price: {
          amount: 1600,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 5,
        tags: ["minimalist", "landscape", "serene", "composition"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
            filename: "minimalist_landscape.jpg",
            size: 1408000,
            isPrimary: true,
          },
        ],
        views: 178,
        likes: [],
      },
    ];

    // Insert all artworks
    let successCount = 0;
    for (const artwork of digitalArtworks) {
      try {
        await Artwork.create(artwork);
        console.log(`✅ Created: ${artwork.title} (${artwork.category})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to create ${artwork.title}:`, error.message);
      }
    }

    // Get final count and distribution
    const totalCount = await Artwork.countDocuments();
    const categoryStats = await Artwork.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log(`\n🎉 Successfully added ${successCount} more artworks!`);
    console.log(`📊 Total artworks in database: ${totalCount}`);
    console.log(`📈 Updated artwork distribution by category:`);

    const categoryEmojis = {
      visual_art: "🎨",
      photography: "📸",
      digital_art: "💻",
      sculpture: "🗿",
      music: "🎵",
      video: "🎥",
      "3d_model": "🎲",
    };

    categoryStats.forEach((stat) => {
      const emoji = categoryEmojis[stat._id] || "🎭";
      console.log(`   ${emoji} ${stat._id}: ${stat.count} artworks`);
    });

    console.log(`\n🌟 Your Browse Art gallery is now incredibly diverse!`);
    console.log(`🔄 Refresh your browser to see all the amazing new artworks`);
  } catch (error) {
    console.error("Error creating digital artworks:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createDigitalArtworks();
