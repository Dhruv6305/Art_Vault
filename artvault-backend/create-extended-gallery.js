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

const createExtendedGallery = async () => {
  try {
    await connectDB();

    console.log("Adding more diverse artworks to create a rich gallery...");

    // Extended diverse artworks
    const extendedArtworks = [
      // More Visual Art
      {
        title: "Mountain Serenity",
        description: "A peaceful mountain landscape painted during golden hour",
        artistName: "Elena Vasquez",
        artist: new mongoose.Types.ObjectId(),
        category: "visual_art",
        subcategory: "Landscape",
        artworkType: "original",
        medium: "Watercolor",
        yearCreated: 2023,
        dimensions: {
          width: 70,
          height: 50,
          unit: "cm",
        },
        price: {
          amount: 1800,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 1,
        tags: ["landscape", "mountains", "watercolor", "peaceful"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
            filename: "mountain_serenity.jpg",
            size: 1920000,
            isPrimary: true,
          },
        ],
        views: 78,
        likes: [],
      },
      {
        title: "City Lights",
        description: "Urban nightscape capturing the energy of city life",
        artistName: "Marcus Thompson",
        artist: new mongoose.Types.ObjectId(),
        category: "visual_art",
        subcategory: "Urban",
        artworkType: "original",
        medium: "Acrylic on Canvas",
        yearCreated: 2024,
        dimensions: {
          width: 120,
          height: 80,
          unit: "cm",
        },
        price: {
          amount: 2800,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 1,
        tags: ["urban", "night", "city", "lights"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop",
            filename: "city_lights.jpg",
            size: 2304000,
            isPrimary: true,
          },
        ],
        views: 145,
        likes: [],
      },
      {
        title: "Floral Symphony",
        description:
          "A vibrant still life celebrating the beauty of spring flowers",
        artistName: "Isabella Chen",
        artist: new mongoose.Types.ObjectId(),
        category: "visual_art",
        subcategory: "Still Life",
        artworkType: "original",
        medium: "Oil on Canvas",
        yearCreated: 2024,
        dimensions: {
          width: 60,
          height: 80,
          unit: "cm",
        },
        price: {
          amount: 2200,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 1,
        tags: ["flowers", "still life", "colorful", "spring"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
            filename: "floral_symphony.jpg",
            size: 1856000,
            isPrimary: true,
          },
        ],
        views: 203,
        likes: [],
      },

      // More Photography
      {
        title: "Wildlife Portrait",
        description:
          "Intimate portrait of a majestic eagle in its natural habitat",
        artistName: "James Wilson",
        artist: new mongoose.Types.ObjectId(),
        category: "photography",
        subcategory: "Wildlife",
        artworkType: "print",
        medium: "Digital Photography",
        yearCreated: 2024,
        dimensions: {
          width: 60,
          height: 40,
          unit: "cm",
        },
        price: {
          amount: 1200,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 8,
        tags: ["wildlife", "eagle", "nature", "portrait"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1551522435-a13afa10f103?w=800&h=600&fit=crop",
            filename: "eagle_portrait.jpg",
            size: 1536000,
            isPrimary: true,
          },
        ],
        views: 167,
        likes: [],
      },
      {
        title: "Architectural Lines",
        description:
          "Modern architecture study focusing on geometric patterns and light",
        artistName: "Sofia Rodriguez",
        artist: new mongoose.Types.ObjectId(),
        category: "photography",
        subcategory: "Architecture",
        artworkType: "print",
        medium: "Digital Photography",
        yearCreated: 2024,
        dimensions: {
          width: 80,
          height: 60,
          unit: "cm",
        },
        price: {
          amount: 950,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 12,
        tags: ["architecture", "modern", "geometric", "lines"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
            filename: "architectural_lines.jpg",
            size: 1792000,
            isPrimary: true,
          },
        ],
        views: 134,
        likes: [],
      },
      {
        title: "Ocean Waves",
        description:
          "Dramatic seascape capturing the power and beauty of ocean waves",
        artistName: "Michael O'Connor",
        artist: new mongoose.Types.ObjectId(),
        category: "photography",
        subcategory: "Seascape",
        artworkType: "print",
        medium: "Digital Photography",
        yearCreated: 2023,
        dimensions: {
          width: 100,
          height: 70,
          unit: "cm",
        },
        price: {
          amount: 1400,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 6,
        tags: ["ocean", "waves", "seascape", "dramatic"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
            filename: "ocean_waves.jpg",
            size: 2048000,
            isPrimary: true,
          },
        ],
        views: 289,
        likes: [],
      },

      // More Digital Art
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
          width: 1920,
          height: 1080,
          unit: "px",
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
          width: 2560,
          height: 1440,
          unit: "px",
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
          width: 1080,
          height: 1350,
          unit: "px",
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

      // More Sculptures
      {
        title: "Abstract Flow",
        description:
          "Contemporary sculpture exploring fluid forms in polished steel",
        artistName: "Viktor Petrov",
        artist: new mongoose.Types.ObjectId(),
        category: "sculpture",
        subcategory: "Abstract",
        artworkType: "original",
        medium: "Stainless Steel",
        yearCreated: 2023,
        dimensions: {
          width: 40,
          height: 60,
          depth: 30,
          unit: "cm",
        },
        price: {
          amount: 8500,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 1,
        tags: ["sculpture", "steel", "abstract", "modern"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            filename: "abstract_flow.jpg",
            size: 1856000,
            isPrimary: true,
          },
        ],
        views: 89,
        likes: [],
      },
      {
        title: "Ceramic Vessel",
        description:
          "Handcrafted ceramic vessel with traditional glazing techniques",
        artistName: "Yuki Tanaka",
        artist: new mongoose.Types.ObjectId(),
        category: "sculpture",
        subcategory: "Ceramics",
        artworkType: "original",
        medium: "Ceramic",
        yearCreated: 2024,
        dimensions: {
          width: 25,
          height: 35,
          depth: 25,
          unit: "cm",
        },
        price: {
          amount: 3200,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 1,
        tags: ["ceramic", "vessel", "traditional", "handmade"],
        files: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            filename: "ceramic_vessel.jpg",
            size: 1536000,
            isPrimary: true,
          },
        ],
        views: 67,
        likes: [],
      },

      // More Music
      {
        title: "Classical Fusion",
        description:
          "Modern interpretation of classical themes with electronic elements",
        artistName: "Symphony Digital",
        artist: new mongoose.Types.ObjectId(),
        category: "music",
        subcategory: "Classical Fusion",
        artworkType: "digital",
        medium: "Digital Audio",
        yearCreated: 2024,
        price: {
          amount: 800,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 100,
        tags: ["classical", "electronic", "fusion", "orchestral"],
        files: [
          {
            type: "audio",
            url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            filename: "classical_fusion.mp3",
            size: 5242880,
            isPrimary: true,
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
            filename: "classical_fusion_cover.jpg",
            size: 1024000,
            isPrimary: false,
          },
        ],
        views: 234,
        likes: [],
      },
      {
        title: "Indie Rock Anthem",
        description:
          "Energetic indie rock track with catchy melodies and driving rhythms",
        artistName: "The Midnight Collective",
        artist: new mongoose.Types.ObjectId(),
        category: "music",
        subcategory: "Indie Rock",
        artworkType: "digital",
        medium: "Digital Audio",
        yearCreated: 2024,
        price: {
          amount: 600,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 50,
        tags: ["indie", "rock", "energetic", "guitar"],
        files: [
          {
            type: "audio",
            url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            filename: "indie_rock_anthem.mp3",
            size: 4194304,
            isPrimary: true,
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
            filename: "indie_rock_cover.jpg",
            size: 896000,
            isPrimary: false,
          },
        ],
        views: 189,
        likes: [],
      },

      // More Video Art
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
        dimensions: {
          width: 1920,
          height: 1080,
          unit: "px",
        },
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
        dimensions: {
          width: 3840,
          height: 2160,
          unit: "px",
        },
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
    ];

    // Insert all artworks
    let successCount = 0;
    for (const artwork of extendedArtworks) {
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

    console.log(`\n🎉 Successfully added ${successCount} new artworks!`);
    console.log(`📊 Total artworks in database: ${totalCount}`);
    console.log(`📈 Artwork distribution by category:`);

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

    console.log(`\n🌟 Your Browse Art page now has a rich, diverse gallery!`);
    console.log(`🔄 Refresh your browser to see all the new artworks`);
  } catch (error) {
    console.error("Error creating extended gallery:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createExtendedGallery();
