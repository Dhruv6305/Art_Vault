// 3D Model Categories and Subcategories Configuration

export const threeDCategories = {
  "3d_model": {
    name: "3D Models",
    icon: "🎲",
    description: "Three-dimensional digital artwork and models",
    subcategories: {
      // Character & Creature Models
      character: {
        name: "Characters",
        icon: "👤",
        description: "Human characters, avatars, and personas",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "ma", "mb"],
        tags: ["character", "human", "avatar", "person", "figure"],
      },
      creature: {
        name: "Creatures & Animals",
        icon: "🐉",
        description: "Fantasy creatures, animals, and mythical beings",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "ma", "mb"],
        tags: ["creature", "animal", "fantasy", "dragon", "monster", "beast"],
      },

      // Architectural & Environmental
      architecture: {
        name: "Architecture",
        icon: "🏛️",
        description: "Buildings, structures, and architectural elements",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "3ds", "dae"],
        tags: [
          "building",
          "architecture",
          "structure",
          "house",
          "tower",
          "bridge",
        ],
      },
      environment: {
        name: "Environments",
        icon: "🌍",
        description: "Landscapes, scenes, and environmental assets",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "dae"],
        tags: [
          "environment",
          "landscape",
          "scene",
          "terrain",
          "nature",
          "outdoor",
        ],
      },
      interior: {
        name: "Interior Design",
        icon: "🏠",
        description: "Interior spaces, rooms, and indoor environments",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "3ds"],
        tags: ["interior", "room", "indoor", "furniture", "decor", "space"],
      },

      // Vehicles & Mechanical
      vehicle: {
        name: "Vehicles",
        icon: "🚗",
        description: "Cars, aircraft, ships, and transportation",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "3ds", "ma"],
        tags: ["vehicle", "car", "aircraft", "ship", "transport", "mechanical"],
      },
      mechanical: {
        name: "Mechanical & Industrial",
        icon: "⚙️",
        description: "Machinery, tools, and industrial equipment",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "step", "iges"],
        tags: [
          "mechanical",
          "machine",
          "tool",
          "industrial",
          "equipment",
          "gear",
        ],
      },

      // Props & Objects
      prop: {
        name: "Props & Objects",
        icon: "📦",
        description: "General objects, props, and everyday items",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "3ds"],
        tags: ["prop", "object", "item", "asset", "everyday", "utility"],
      },
      furniture: {
        name: "Furniture",
        icon: "🪑",
        description: "Chairs, tables, beds, and furniture pieces",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "3ds"],
        tags: ["furniture", "chair", "table", "bed", "sofa", "cabinet"],
      },
      weapon: {
        name: "Weapons & Armor",
        icon: "⚔️",
        description: "Fantasy and historical weapons and armor",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "ma"],
        tags: ["weapon", "armor", "sword", "shield", "fantasy", "medieval"],
      },

      // Artistic & Abstract
      sculpture: {
        name: "Digital Sculptures",
        icon: "🗿",
        description: "Artistic sculptures and sculptural forms",
        formats: ["obj", "stl", "ply", "blend", "fbx", "gltf"],
        tags: ["sculpture", "art", "artistic", "statue", "form", "abstract"],
      },
      abstract: {
        name: "Abstract Art",
        icon: "🎨",
        description: "Abstract and conceptual 3D artwork",
        formats: ["obj", "blend", "fbx", "gltf", "glb", "x3d"],
        tags: ["abstract", "conceptual", "artistic", "modern", "experimental"],
      },

      // Technical & Scientific
      scientific: {
        name: "Scientific Models",
        icon: "🔬",
        description: "Scientific visualizations and educational models",
        formats: ["obj", "ply", "stl", "x3d", "gltf", "blend"],
        tags: [
          "scientific",
          "educational",
          "medical",
          "molecular",
          "anatomy",
          "research",
        ],
      },
      technical: {
        name: "Technical Drawings",
        icon: "📐",
        description: "CAD models and technical illustrations",
        formats: ["step", "iges", "obj", "stl", "3ds", "dwg"],
        tags: [
          "technical",
          "cad",
          "engineering",
          "blueprint",
          "design",
          "precision",
        ],
      },

      // Gaming & Animation
      game_asset: {
        name: "Game Assets",
        icon: "🎮",
        description: "Models optimized for games and real-time rendering",
        formats: ["fbx", "gltf", "glb", "obj", "blend", "unity"],
        tags: ["game", "gaming", "asset", "realtime", "lowpoly", "optimized"],
      },
      animation: {
        name: "Animation Ready",
        icon: "🎬",
        description: "Rigged models ready for animation",
        formats: ["fbx", "blend", "ma", "mb", "dae", "bvh"],
        tags: [
          "animation",
          "rigged",
          "bones",
          "skeleton",
          "motion",
          "animated",
        ],
      },

      // Jewelry & Fashion
      jewelry: {
        name: "Jewelry",
        icon: "💎",
        description: "Rings, necklaces, and jewelry designs",
        formats: ["obj", "stl", "3dm", "blend", "fbx", "step"],
        tags: ["jewelry", "ring", "necklace", "diamond", "precious", "luxury"],
      },
      fashion: {
        name: "Fashion & Clothing",
        icon: "👗",
        description: "Clothing, accessories, and fashion items",
        formats: ["fbx", "blend", "obj", "gltf", "ma", "md"],
        tags: [
          "fashion",
          "clothing",
          "dress",
          "accessory",
          "textile",
          "apparel",
        ],
      },

      // Nature & Organic
      plant: {
        name: "Plants & Nature",
        icon: "🌿",
        description: "Trees, flowers, and natural organic forms",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "speedtree"],
        tags: ["plant", "tree", "flower", "nature", "organic", "botanical"],
      },
      food: {
        name: "Food & Beverages",
        icon: "🍎",
        description: "Food items, drinks, and culinary objects",
        formats: ["fbx", "blend", "obj", "gltf", "glb", "3ds"],
        tags: ["food", "drink", "culinary", "fruit", "vegetable", "meal"],
      },
    },
  },
};

// File format information
export const threeDFormats = {
  // Industry Standard Formats
  fbx: {
    name: "Autodesk FBX",
    description: "Industry standard for 3D asset exchange",
    supports: [
      "geometry",
      "materials",
      "textures",
      "animations",
      "cameras",
      "lights",
    ],
    software: ["Maya", "3ds Max", "Blender", "Unity", "Unreal Engine"],
    fileSize: "medium",
    compatibility: "excellent",
  },
  obj: {
    name: "Wavefront OBJ",
    description: "Simple and widely supported geometry format",
    supports: ["geometry", "materials", "textures"],
    software: ["Most 3D software"],
    fileSize: "small",
    compatibility: "universal",
  },
  gltf: {
    name: "GL Transmission Format",
    description: "Modern web-optimized 3D format",
    supports: ["geometry", "materials", "textures", "animations", "PBR"],
    software: ["Blender", "Web browsers", "Three.js"],
    fileSize: "optimized",
    compatibility: "web-focused",
  },
  glb: {
    name: "Binary GLTF",
    description: "Binary version of GLTF for better performance",
    supports: ["geometry", "materials", "textures", "animations", "PBR"],
    software: ["Blender", "Web browsers", "Three.js"],
    fileSize: "compact",
    compatibility: "web-focused",
  },

  // Software-Specific Formats
  blend: {
    name: "Blender File",
    description: "Native Blender format with full scene data",
    supports: ["everything", "nodes", "modifiers", "physics"],
    software: ["Blender"],
    fileSize: "large",
    compatibility: "blender-only",
  },
  ma: {
    name: "Maya ASCII",
    description: "Maya scene file in text format",
    supports: ["geometry", "materials", "animations", "dynamics"],
    software: ["Maya", "MotionBuilder"],
    fileSize: "large",
    compatibility: "maya-focused",
  },
  mb: {
    name: "Maya Binary",
    description: "Maya scene file in binary format",
    supports: ["geometry", "materials", "animations", "dynamics"],
    software: ["Maya", "MotionBuilder"],
    fileSize: "medium",
    compatibility: "maya-focused",
  },

  // CAD and Technical Formats
  step: {
    name: "STEP File",
    description: "Standard for technical CAD data exchange",
    supports: ["precise geometry", "assemblies", "metadata"],
    software: ["CAD software", "SolidWorks", "AutoCAD"],
    fileSize: "medium",
    compatibility: "cad-focused",
  },
  iges: {
    name: "IGES File",
    description: "Initial Graphics Exchange Specification",
    supports: ["geometry", "curves", "surfaces"],
    software: ["CAD software", "engineering tools"],
    fileSize: "medium",
    compatibility: "cad-focused",
  },
  stl: {
    name: "Stereolithography",
    description: "Simple triangle mesh format for 3D printing",
    supports: ["geometry only"],
    software: ["3D printing software", "CAD tools"],
    fileSize: "small",
    compatibility: "3d-printing",
  },

  // Legacy and Specialized Formats
  "3ds": {
    name: "3D Studio",
    description: "Legacy 3ds Max format",
    supports: ["geometry", "materials", "basic animations"],
    software: ["3ds Max", "legacy software"],
    fileSize: "small",
    compatibility: "legacy",
  },
  dae: {
    name: "COLLADA",
    description: "Open standard for 3D asset exchange",
    supports: ["geometry", "materials", "animations", "physics"],
    software: ["Various 3D software"],
    fileSize: "medium",
    compatibility: "good",
  },
  x3d: {
    name: "Extensible 3D",
    description: "Web-based 3D graphics standard",
    supports: ["geometry", "materials", "animations", "interactivity"],
    software: ["Web browsers", "specialized viewers"],
    fileSize: "medium",
    compatibility: "web-specialized",
  },
  ply: {
    name: "Stanford PLY",
    description: "Simple format for storing 3D scan data",
    supports: ["geometry", "vertex colors"],
    software: ["Research tools", "3D scanners"],
    fileSize: "variable",
    compatibility: "research-focused",
  },
};

// Helper functions
export const getSubcategoriesForCategory = (category) => {
  return threeDCategories[category]?.subcategories || {};
};

export const getSupportedFormatsForSubcategory = (category, subcategory) => {
  return threeDCategories[category]?.subcategories[subcategory]?.formats || [];
};

export const getFormatInfo = (format) => {
  return threeDFormats[format.toLowerCase()] || null;
};

export const isFormatSupported = (filename) => {
  const extension = filename.toLowerCase().split(".").pop();
  return Object.keys(threeDFormats).includes(extension);
};

export const getRecommendedFormats = () => {
  return ["gltf", "glb", "fbx", "obj"]; // Most web-compatible formats
};

export default {
  threeDCategories,
  threeDFormats,
  getSubcategoriesForCategory,
  getSupportedFormatsForSubcategory,
  getFormatInfo,
  isFormatSupported,
  getRecommendedFormats,
};
