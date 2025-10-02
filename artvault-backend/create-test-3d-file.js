const fs = require("fs");
const path = require("path");

console.log("🎲 Creating Test 3D Files for Upload Testing");
console.log("============================================");

// Create a simple GLTF file (JSON format)
const simpleGLTF = {
  asset: {
    version: "2.0",
    generator: "Test Generator",
  },
  scene: 0,
  scenes: [
    {
      name: "Scene",
      nodes: [0],
    },
  ],
  nodes: [
    {
      name: "Cube",
      mesh: 0,
    },
  ],
  meshes: [
    {
      name: "Cube",
      primitives: [
        {
          attributes: {
            POSITION: 0,
          },
          indices: 1,
        },
      ],
    },
  ],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126,
      count: 8,
      type: "VEC3",
      max: [1, 1, 1],
      min: [-1, -1, -1],
    },
    {
      bufferView: 1,
      componentType: 5123,
      count: 36,
      type: "SCALAR",
    },
  ],
  bufferViews: [
    {
      buffer: 0,
      byteOffset: 0,
      byteLength: 96,
    },
    {
      buffer: 0,
      byteOffset: 96,
      byteLength: 72,
    },
  ],
  buffers: [
    {
      byteLength: 168,
      uri: "data:application/octet-stream;base64,AACAPwAAgD8AAIA/AACAPwAAgD8AAIC/AACAPwAAgL8AAIA/AACAPwAAgL8AAIC/AACAvwAAgD8AAIA/AACAvwAAgD8AAIC/AACAvwAAgL8AAIA/AACAvwAAgL8AAIC/AAAAAAAAgD8AAAAAAACAPwAAAAAAAAC/AAAAAAAAgL8AAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAgD8AAAAAAACAvwAAAAAAAAC/AACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAA",
    },
  ],
};

// Create a simple OBJ file
const simpleOBJ = `# Simple Cube OBJ File
# Created for testing

v -1.0 -1.0  1.0
v  1.0 -1.0  1.0
v  1.0  1.0  1.0
v -1.0  1.0  1.0
v -1.0 -1.0 -1.0
v  1.0 -1.0 -1.0
v  1.0  1.0 -1.0
v -1.0  1.0 -1.0

f 1 2 3 4
f 8 7 6 5
f 4 3 7 8
f 5 1 4 8
f 5 6 2 1
f 2 6 7 3
`;

// Create test files
const testDir = path.join(__dirname, "test-3d-files");
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
}

const gltfPath = path.join(testDir, "test-cube.gltf");
const objPath = path.join(testDir, "test-cube.obj");

fs.writeFileSync(gltfPath, JSON.stringify(simpleGLTF, null, 2));
fs.writeFileSync(objPath, simpleOBJ);

console.log("✅ Created test files:");
console.log(`   📄 ${gltfPath}`);
console.log(`   📄 ${objPath}`);

// Get file sizes
const gltfSize = fs.statSync(gltfPath).size;
const objSize = fs.statSync(objPath).size;

console.log("\n📊 File Information:");
console.log(`   GLTF: ${(gltfSize / 1024).toFixed(2)} KB`);
console.log(`   OBJ:  ${(objSize / 1024).toFixed(2)} KB`);

console.log("\n💡 Usage Instructions:");
console.log("1. Go to http://localhost:5173/add-artwork");
console.log("2. Login with any existing user");
console.log("3. Use the DebugUpload component to test these files");
console.log("4. Or use them in the regular upload flow");
console.log("\n📁 Test files location:", testDir);
