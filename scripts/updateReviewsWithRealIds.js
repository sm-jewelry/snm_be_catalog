import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// MongoDB connection strings for different databases
const CATALOG_DB_URI = process.env.MONGO_URI;
const USER_DB_URI = process.env.USER_DB_URI || "mongodb://localhost:27017/snm_jewelry_customers";

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    productTitle: { type: String, required: true },
    orderId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 200 },
    comment: { type: String, required: true, maxlength: 2000 },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    adminNotes: { type: String },
    moderatedBy: { type: String },
    moderatedAt: { type: Date },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    notHelpfulCount: { type: Number, default: 0 },
    helpfulVotes: [
      {
        userId: String,
        vote: { type: String, enum: ["helpful", "notHelpful"] },
      },
    ],
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, orderId: 1, productId: 1 }, { unique: true });

// Catalog Schema (products are stored as catalogs)
const catalogSchema = new mongoose.Schema({
  title: String,
  price: Number,
  rating: Number,
  reviewCount: Number,
  stock: Number,
  SKU: String,
  URL: String,
  category: mongoose.Schema.Types.ObjectId,
  c1: mongoose.Schema.Types.ObjectId,
  c2: mongoose.Schema.Types.ObjectId,
  c3: mongoose.Schema.Types.ObjectId,
  salesCount: Number,
  brand: String,
  isFeatured: Boolean,
});

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: String,
  isActive: Boolean,
});

// Create models
const Review = mongoose.model("Review", reviewSchema);
const Catalog = mongoose.model("Catalog", catalogSchema);

async function updateReviewsWithRealIds() {
  let catalogConnection = null;
  let userConnection = null;

  try {
    console.log("\n" + "=".repeat(70));
    console.log("🔄 STARTING REVIEW UPDATE PROCESS");
    console.log("=".repeat(70) + "\n");

    // Connect to catalog database
    console.log("📡 Connecting to Catalog Database...");
    catalogConnection = await mongoose.connect(CATALOG_DB_URI);
    console.log("✅ Connected to Catalog Database\n");

    // Create separate connection for user database if different
    let User;
    if (USER_DB_URI && USER_DB_URI !== CATALOG_DB_URI) {
      console.log("📡 Connecting to User Database...");
      userConnection = await mongoose.createConnection(USER_DB_URI);
      User = userConnection.model("User", userSchema);
      console.log("✅ Connected to User Database\n");
    } else {
      User = mongoose.model("User", userSchema);
      console.log("ℹ️  Using same database for users\n");
    }

    // Fetch all catalogs (products)
    console.log("📦 Fetching catalogs (products) from database...");
    const catalogs = await Catalog.find({}).select("_id title").lean();

    if (catalogs.length === 0) {
      console.log("❌ No catalogs found in database. Cannot update reviews.");
      process.exit(1);
    }
    console.log(`✅ Found ${catalogs.length} catalogs\n`);

    // Fetch all users
    console.log("👥 Fetching users from database...");
    const users = await User.find({ isActive: true })
      .select("_id email firstName lastName")
      .lean();

    if (users.length === 0) {
      console.log("❌ No users found in database. Cannot update reviews.");
      process.exit(1);
    }
    console.log(`✅ Found ${users.length} active users\n`);

    // Fetch all reviews
    console.log("📝 Fetching reviews from database...");
    const reviews = await Review.find({});
    console.log(`✅ Found ${reviews.length} reviews to update\n`);

    if (reviews.length === 0) {
      console.log("ℹ️  No reviews to update. Exiting...");
      process.exit(0);
    }

    console.log("=".repeat(70));
    console.log("🔧 UPDATING REVIEWS");
    console.log("=".repeat(70) + "\n");

    let updatedCount = 0;
    let errorCount = 0;
    const errors = [];

    // Update each review
    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      const reviewNum = i + 1;

      try {
        // Select a random catalog (product)
        const randomCatalog = catalogs[Math.floor(Math.random() * catalogs.length)];

        // Select a random user
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // Store old values for logging
        const oldProductId = review.productId;
        const oldUserId = review.userId;

        // Update review with real IDs
        review.productId = randomCatalog._id;
        review.productTitle = randomCatalog.title;
        review.userId = randomUser._id.toString();
        review.userName = `${randomUser.firstName} ${randomUser.lastName}`;
        review.userEmail = randomUser.email;

        // Update orderId to make it unique
        review.orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Save the updated review
        await review.save();

        updatedCount++;
        console.log(`✓ [${reviewNum}/${reviews.length}] Updated review:`);
        console.log(`  Product: ${oldProductId} → ${randomCatalog._id} (${randomCatalog.title})`);
        console.log(`  User: ${oldUserId} → ${randomUser._id} (${randomUser.firstName} ${randomUser.lastName})`);
        console.log("");

      } catch (error) {
        errorCount++;
        const errorMsg = `Review ${reviewNum}: ${error.message}`;
        errors.push(errorMsg);

        // If it's a duplicate key error, try with different product/user
        if (error.code === 11000) {
          console.log(`⚠ [${reviewNum}/${reviews.length}] Duplicate found, retrying with different IDs...`);

          try {
            // Try again with different random selections
            const newCatalog = catalogs[Math.floor(Math.random() * catalogs.length)];
            const newUser = users[Math.floor(Math.random() * users.length)];

            review.productId = newCatalog._id;
            review.productTitle = newCatalog.title;
            review.userId = newUser._id.toString();
            review.userName = `${newUser.firstName} ${newUser.lastName}`;
            review.userEmail = newUser.email;
            review.orderId = `ORD${Date.now()}${Math.floor(Math.random() * 10000)}`;

            await review.save();
            updatedCount++;
            errorCount--;
            errors.pop();

            console.log(`✓ [${reviewNum}/${reviews.length}] Successfully updated on retry`);
            console.log("");
          } catch (retryError) {
            console.log(`✗ [${reviewNum}/${reviews.length}] Failed on retry: ${retryError.message}`);
            console.log("");
          }
        } else {
          console.log(`✗ [${reviewNum}/${reviews.length}] Error: ${error.message}`);
          console.log("");
        }
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("📊 UPDATE SUMMARY");
    console.log("=".repeat(70));
    console.log(`Total Reviews: ${reviews.length}`);
    console.log(`✅ Successfully Updated: ${updatedCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log("=".repeat(70));

    if (errors.length > 0) {
      console.log("\n⚠️  ERRORS ENCOUNTERED:");
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // Update catalog ratings and review counts
    console.log("\n" + "=".repeat(70));
    console.log("🔄 UPDATING CATALOG RATINGS");
    console.log("=".repeat(70) + "\n");

    for (const catalog of catalogs) {
      const stats = await Review.aggregate([
        {
          $match: {
            productId: catalog._id,
            status: "approved",
          },
        },
        {
          $group: {
            _id: "$productId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      if (stats.length > 0) {
        const rating = Math.round(stats[0].averageRating * 10) / 10;
        const reviewCount = stats[0].totalReviews;

        await Catalog.findByIdAndUpdate(catalog._id, {
          rating,
          reviewCount,
        });

        console.log(`✓ ${catalog.title}: ${rating} stars (${reviewCount} reviews)`);
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(70) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ FATAL ERROR:", error);
    console.error("\nStack trace:", error.stack);
    process.exit(1);
  } finally {
    // Close connections
    if (catalogConnection) {
      await catalogConnection.disconnect();
    }
    if (userConnection) {
      await userConnection.close();
    }
  }
}

// Run the migration
updateReviewsWithRealIds();
