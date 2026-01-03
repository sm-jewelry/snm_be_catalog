import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;

// Catalog Schema
const catalogSchema = new mongoose.Schema({
  title: String,
  price: Number,
  stock: Number,
  SKU: String,
  URL: String,
  category: mongoose.Schema.Types.ObjectId,
  collection: mongoose.Schema.Types.ObjectId,
  c1: mongoose.Schema.Types.ObjectId,
  c2: mongoose.Schema.Types.ObjectId,
  c3: mongoose.Schema.Types.ObjectId,
  salesCount: Number,
  rating: Number,
  reviewCount: Number,
  brand: String,
  isFeatured: Boolean,
});

// Collection Schema
const collectionSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  isActive: Boolean,
});

const Catalog = mongoose.model("Catalog", catalogSchema);
const Collection = mongoose.model("Collection", collectionSchema);

async function assignCollectionsToProducts() {
  try {
    console.log("\n" + "=".repeat(70));
    console.log("🔄 ASSIGNING COLLECTIONS TO PRODUCTS");
    console.log("=".repeat(70) + "\n");

    // Connect to database
    console.log("📡 Connecting to Database...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to Database\n");

    // Fetch all collections
    console.log("📦 Fetching collections...");
    const collections = await Collection.find({}).lean();

    if (collections.length === 0) {
      console.log("❌ No collections found in database.");
      process.exit(1);
    }

    console.log(`✅ Found ${collections.length} collections:`);
    collections.forEach((col, idx) => {
      console.log(`   ${idx + 1}. ${col.name} (${col._id})`);
    });
    console.log("");

    // Fetch all products
    console.log("📦 Fetching products...");
    const products = await Catalog.find({});

    if (products.length === 0) {
      console.log("❌ No products found in database.");
      process.exit(1);
    }

    console.log(`✅ Found ${products.length} products\n`);

    console.log("=" + "=".repeat(69));
    console.log("🔧 ASSIGNING RANDOM COLLECTIONS");
    console.log("=" + "=".repeat(69) + "\n");

    let updatedCount = 0;
    const collectionCounts = {};
    collections.forEach(col => {
      collectionCounts[col._id.toString()] = 0;
    });

    // Assign random collections to products
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // Select a random collection
      const randomCollection = collections[Math.floor(Math.random() * collections.length)];

      // Update product with collection
      product.collection = randomCollection._id;
      await product.save();

      updatedCount++;
      collectionCounts[randomCollection._id.toString()]++;

      console.log(`✓ [${i + 1}/${products.length}] ${product.title}`);
      console.log(`  → Assigned: ${randomCollection.name}`);
      console.log("");
    }

    console.log("\n" + "=".repeat(70));
    console.log("📊 ASSIGNMENT SUMMARY");
    console.log("=".repeat(70));
    console.log(`Total Products Updated: ${updatedCount}`);
    console.log("\nProducts per Collection:");
    collections.forEach(col => {
      const count = collectionCounts[col._id.toString()];
      console.log(`  ${col.name}: ${count} products`);
    });
    console.log("=".repeat(70));

    console.log("\n✅ MIGRATION COMPLETED SUCCESSFULLY!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ FATAL ERROR:", error);
    console.error("\nStack trace:", error.stack);
    process.exit(1);
  }
}

// Run the migration
assignCollectionsToProducts();
