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

const createFinalBatch = async () => {
  try {
    await connectDB();

    console.log(
      "Adding final batch of diverse artworks for a complete gallery..."
    );

    const finalBatch = [
      // More Sculptures
      {
        title: "Bronze Figure",
        description:
          "Classical bronze sculpture depicting human form in motion",
        artistName: "Roberto Martinez",
        artist: new mongoose.Types.ObjectId(),
        category: "sculpture",
        subcategory: "Figurative",
        artworkType: "original",
        medium: "Bronze",
        yearCreated: 2023,
        dimensions: {
          width: 30,
          height: 80,
          depth: 25,
          unit: "cm",
        },
        price: {
          amount: 12000,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 1,
        tags: ["bronze", "figurative", "classical", "motion"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            filename: "bronze_figure.jpg",
            size: 1920000,
            isPrimary: true,
          },
        ],
        views: 145,
        likes: [],
      },
      {
        title: "Wood Carving",
        description:
          "Intricate wood carving showcasing traditional craftsmanship",
        artistName: "Hiroshi Yamamoto",
        artist: new mongoose.Types.ObjectId(),
        category: "sculpture",
        subcategory: "Wood Carving",
        artworkType: "original",
        medium: "Teak Wood",
        yearCreated: 2024,
        dimensions: {
          width: 20,
          height: 40,
          depth: 15,
          unit: "cm",
        },
        price: {
          amount: 4500,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 1,
        tags: ["wood", "carving", "traditional", "craftsmanship"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            filename: "wood_carving.jpg",
            size: 1536000,
            isPrimary: true,
          },
        ],
        views: 87,
        likes: [],
      },

      // More Music
      {
        title: "Electronic Beats",
        description:
          "High-energy electronic music track perfect for dance floors",
        artistName: "DJ Pulse",
        artist: new mongoose.Types.ObjectId(),
        category: "music",
        subcategory: "Electronic",
        artworkType: "digital",
        medium: "Digital Audio",
        yearCreated: 2024,
        price: {
          amount: 700,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 200,
        tags: ["electronic", "dance", "beats", "energy"],
        files: [
          {
            type: "audio",
            url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            filename: "electronic_beats.mp3",
            size: 6291456,
            isPrimary: true,
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
            filename: "electronic_beats_cover.jpg",
            size: 1024000,
            isPrimary: false,
          },
        ],
        views: 567,
        likes: [],
      },
      {
        title: "Acoustic Melody",
        description:
          "Soothing acoustic guitar composition with gentle melodies",
        artistName: "Sarah Mitchell",
        artist: new mongoose.Types.ObjectId(),
        category: "music",
        subcategory: "Acoustic",
        artworkType: "digital",
        medium: "Digital Audio",
        yearCreated: 2024,
        price: {
          amount: 500,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 75,
        tags: ["acoustic", "guitar", "soothing", "melody"],
        files: [
          {
            type: "audio",
            url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            filename: "acoustic_melody.mp3",
            size: 4194304,
            isPrimary: true,
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
            filename: "acoustic_cover.jpg",
            size: 768000,
            isPrimary: false,
          },
        ],
        views: 234,
        likes: [],
      },

      // More Visual Art
      {
        title: "Watercolor Seascape",
        description: "Delicate watercolor painting of a peaceful coastal scene",
        artistName: "Emma Thompson",
        artist: new mongoose.Types.ObjectId(),
        category: "visual_art",
        subcategory: "Seascape",
        artworkType: "original",
        medium: "Watercolor",
        yearCreated: 2024,
        dimensions: {
          width: 50,
          height: 35,
          unit: "cm",
        },
        price: {
          amount: 1400,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 1,
        tags: ["watercolor", "seascape", "peaceful", "coastal"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
            filename: "watercolor_seascape.jpg",
            size: 1408000,
            isPrimary: true,
          },
        ],
        views: 167,
        likes: [],
      },
      {
        title: "Oil Landscape",
        description:
          "Rich oil painting of autumn countryside with vibrant colors",
        artistName: "Thomas Anderson",
        artist: new mongoose.Types.ObjectId(),
        category: "visual_art",
        subcategory: "Landscape",
        artworkType: "original",
        medium: "Oil on Canvas",
        yearCreated: 2023,
        dimensions: {
          width: 100,
          height: 70,
          unit: "cm",
        },
        price: {
          amount: 3200,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 1,
        tags: ["oil", "landscape", "autumn", "countryside"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
            filename: "oil_landscape.jpg",
            size: 2048000,
            isPrimary: true,
          },
        ],
        views: 289,
        likes: [],
      },
      {
        title: "Mixed Media Collage",
        description:
          "Contemporary mixed media artwork combining various materials and textures",
        artistName: "Luna Garcia",
        artist: new mongoose.Types.ObjectId(),
        category: "visual_art",
        subcategory: "Mixed Media",
        artworkType: "original",
        medium: "Mixed Media",
        yearCreated: 2024,
        dimensions: {
          width: 80,
          height: 60,
          unit: "cm",
        },
        price: {
          amount: 2400,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 1,
        tags: ["mixed media", "collage", "contemporary", "texture"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
            filename: "mixed_media_collage.jpg",
            size: 1856000,
            isPrimary: true,
          },
        ],
        views: 198,
        likes: [],
      },

      // More Photography
      {
        title: "Black & White Portrait",
        description:
          "Dramatic black and white portrait showcasing emotion and character",
        artistName: "Vincent Black",
        artist: new mongoose.Types.ObjectId(),
        category: "photography",
        subcategory: "Portrait",
        artworkType: "print",
        medium: "Digital Photography",
        yearCreated: 2024,
        dimensions: {
          width: 50,
          height: 70,
          unit: "cm",
        },
        price: {
          amount: 1300,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 8,
        tags: ["black and white", "portrait", "dramatic", "emotion"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
            filename: "bw_portrait.jpg",
            size: 1536000,
            isPrimary: true,
          },
        ],
        views: 245,
        likes: [],
      },
      {
        title: "Abstract Macro",
        description:
          "Close-up abstract photography revealing hidden patterns in nature",
        artistName: "Zoe Chen",
        artist: new mongoose.Types.ObjectId(),
        category: "photography",
        subcategory: "Macro",
        artworkType: "print",
        medium: "Digital Photography",
        yearCreated: 2024,
        dimensions: {
          width: 60,
          height: 40,
          unit: "cm",
        },
        price: {
          amount: 900,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 15,
        tags: ["macro", "abstract", "nature", "patterns"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
            filename: "abstract_macro.jpg",
            size: 1280000,
            isPrimary: true,
          },
        ],
        views: 156,
        likes: [],
      },

      // More Digital Art
      {
        title: "Fantasy Illustration",
        description:
          "Magical fantasy illustration featuring mythical creatures and enchanted landscapes",
        artistName: "Mystic Arts Studio",
        artist: new mongoose.Types.ObjectId(),
        category: "digital_art",
        subcategory: "Fantasy",
        artworkType: "digital",
        medium: "Digital Illustration",
        yearCreated: 2024,
        dimensions: {
          width: 70,
          height: 50,
          unit: "cm",
        },
        price: {
          amount: 1900,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 3,
        tags: ["fantasy", "mythical", "creatures", "magical"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
            filename: "fantasy_illustration.jpg",
            size: 2304000,
            isPrimary: true,
          },
        ],
        views: 423,
        likes: [],
      },
      {
        title: "Concept Art",
        description:
          "Professional concept art for video game environments and characters",
        artistName: "Game Design Co.",
        artist: new mongoose.Types.ObjectId(),
        category: "digital_art",
        subcategory: "Concept Art",
        artworkType: "digital",
        medium: "Digital Painting",
        yearCreated: 2024,
        dimensions: {
          width: 90,
          height: 60,
          unit: "cm",
        },
        price: {
          amount: 2500,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 2,
        tags: ["concept art", "game design", "environment", "character"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop",
            filename: "concept_art.jpg",
            size: 2560000,
            isPrimary: true,
          },
        ],
        views: 378,
        likes: [],
      },

      // More Video
      {
        title: "Time-lapse Art",
        description:
          "Mesmerizing time-lapse video of an artwork being created from start to finish",
        artistName: "Creative Process Films",
        artist: new mongoose.Types.ObjectId(),
        category: "video",
        subcategory: "Time-lapse",
        artworkType: "digital",
        medium: "Digital Video",
        yearCreated: 2024,
        price: {
          amount: 1200,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 20,
        tags: ["time-lapse", "art process", "creative", "behind scenes"],
        files: [
          {
            type: "video",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            filename: "timelapse_art.mp4",
            size: 10485760,
            isPrimary: true,
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
            filename: "timelapse_thumb.jpg",
            size: 896000,
            isPrimary: false,
          },
        ],
        views: 267,
        likes: [],
      },
    ];

    // Insert all artworks
    let successCount = 0;
    for (const artwork of finalBatch) {
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

    console.log(`\n🎉 Successfully added ${successCount} final artworks!`);
    console.log(`📊 FINAL GALLERY SIZE: ${totalCount} artworks`);
    console.log(`📈 Complete artwork distribution by category:`);

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

    console.log(
      `\n🌟 CONGRATULATIONS! Your Browse Art gallery is now COMPLETE!`
    );
    console.log(`🎭 You have a diverse, professional-quality art gallery`);
    console.log(`🔄 Refresh your browser to see the amazing collection`);
    console.log(`💫 Your users will love browsing through all these artworks!`);
  } catch (error) {
    console.error("Error creating final batch:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createFinalBatch();
