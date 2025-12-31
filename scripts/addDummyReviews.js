import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Review Schema (copied from model)
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

// Compound unique index
reviewSchema.index({ userId: 1, orderId: 1, productId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

// Product Schema (simplified)
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  rating: Number,
  reviewCount: Number,
});

const Product = mongoose.model("Product", productSchema);

// Dummy reviews data
const dummyReviews = [
  {
    userId: "694b6a0b0d061f44ab3d6e11",
    userName: "Priya Sharma",
    userEmail: "priya.sharma@example.com",
    // productId will be filled dynamically
    productTitle: "", // will be filled
    orderId: "ORD2024001",
    rating: 5,
    title: "Absolutely Stunning Jewelry!",
    comment:
      "I purchased this beautiful necklace for my wedding and I couldn't be happier! The craftsmanship is exceptional, and it sparkles beautifully. The gold plating is top-notch and hasn't tarnished at all. Highly recommend SNM Jewelry for authentic pieces.",
    images: [],
    status: "approved",
    isVerifiedPurchase: true,
    helpfulCount: 12,
    notHelpfulCount: 0,
  },
  {
    userId: "694b6a0b0d061f44ab3d6e12",
    userName: "Rajesh Kumar",
    userEmail: "rajesh.kumar@example.com",
    productTitle: "",
    orderId: "ORD2024002",
    rating: 4,
    title: "Great Quality, Worth the Price",
    comment:
      "Very satisfied with my purchase. The ring looks exactly as shown in the pictures. The only reason I'm giving 4 stars instead of 5 is that the delivery took a bit longer than expected. But the quality makes up for it!",
    images: [],
    status: "approved",
    isVerifiedPurchase: true,
    helpfulCount: 8,
    notHelpfulCount: 1,
  },
  {
    userId: "694b6a0b0d061f44ab3d6e13",
    userName: "Ananya Reddy",
    userEmail: "ananya.reddy@example.com",
    productTitle: "",
    orderId: "ORD2024003",
    rating: 5,
    title: "Perfect Bridal Jewelry",
    comment:
      "I ordered this set for my sister's wedding and she absolutely loved it! The intricate design work is amazing. The set includes matching earrings and necklace. Perfect for any special occasion. Thank you SNM Jewelry!",
    images: [],
    status: "approved",
    isVerifiedPurchase: true,
    helpfulCount: 15,
    notHelpfulCount: 0,
  },
  {
    userId: "694b6a0b0d061f44ab3d6e14",
    userName: "Vikram Singh",
    userEmail: "vikram.singh@example.com",
    productTitle: "",
    orderId: "ORD2024004",
    rating: 3,
    title: "Good but could be better",
    comment:
      "The jewelry is nice and looks good. However, the clasp on the necklace feels a bit flimsy. I'm worried it might break with regular use. The design is beautiful though. Overall satisfied but expected better quality for the price.",
    images: [],
    status: "approved",
    isVerifiedPurchase: true,
    helpfulCount: 5,
    notHelpfulCount: 2,
  },
  {
    userId: "694b6a0b0d061f44ab3d6e15",
    userName: "Deepika Iyer",
    userEmail: "deepika.iyer@example.com",
    productTitle: "",
    orderId: "ORD2024005",
    rating: 5,
    title: "Exceeded My Expectations!",
    comment:
      "I was skeptical about buying jewelry online, but SNM Jewelry proved me wrong! The piece I received is even more beautiful in person. The packaging was also excellent - came in a beautiful velvet box. Will definitely order again!",
    images: [],
    status: "approved",
    isVerifiedPurchase: true,
    helpfulCount: 20,
    notHelpfulCount: 0,
  },
  {
    userId: "694b6a0b0d061f44ab3d6e16",
    userName: "Amit Patel",
    userEmail: "amit.patel@example.com",
    productTitle: "",
    orderId: "ORD2024006",
    rating: 4,
    title: "Beautiful design, great gift",
    comment:
      "Bought this as an anniversary gift for my wife and she loved it! The design is elegant and traditional. The gold finish is very good. Only minor complaint is that it's slightly heavier than expected, but that also means it feels premium.",
    images: [],
    status: "approved",
    isVerifiedPurchase: true,
    helpfulCount: 7,
    notHelpfulCount: 0,
  },
  {
    userId: "694b6a0b0d061f44ab3d6e17",
    userName: "Sneha Gupta",
    userEmail: "sneha.gupta@example.com",
    productTitle: "",
    orderId: "ORD2024007",
    rating: 5,
    title: "Exquisite Craftsmanship!",
    comment:
      "As a jewelry enthusiast, I'm very particular about quality and design. This piece from SNM Jewelry checks all the boxes! The detailing is intricate, the finish is flawless, and it looks absolutely royal. Perfect for festive occasions.",
    images: [],
    status: "approved",
    isVerifiedPurchase: true,
    helpfulCount: 18,
    notHelpfulCount: 1,
  },
  {
    userId: "694b6a0b0d061f44ab3d6e18",
    userName: "Karthik Menon",
    userEmail: "karthik.menon@example.com",
    productTitle: "",
    orderId: "ORD2024008",
    rating: 4,
    title: "Good purchase, fast delivery",
    comment:
      "The earrings are beautiful and my wife loves them. Delivery was faster than expected which was a pleasant surprise. The only thing I'd suggest is better images on the website - they don't do justice to how beautiful the actual product is!",
    images: [],
    status: "approved",
    isVerifiedPurchase: true,
    helpfulCount: 6,
    notHelpfulCount: 0,
  },
];

async function addDummyReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all products
    const products = await Product.find().limit(10);

    if (products.length === 0) {
      console.log("❌ No products found in database. Please add products first.");
      process.exit(1);
    }

    console.log(`📦 Found ${products.length} products`);

    let reviewsAdded = 0;
    let reviewsSkipped = 0;

    // Add reviews for each product
    for (const product of products) {
      console.log(`\n📝 Adding reviews for: ${product.title}`);

      // Add 2-3 random reviews per product
      const numReviews = Math.floor(Math.random() * 2) + 2; // 2 or 3 reviews

      for (let i = 0; i < numReviews && i < dummyReviews.length; i++) {
        const reviewTemplate = dummyReviews[i];

        try {
          const review = new Review({
            ...reviewTemplate,
            productId: product._id,
            productTitle: product.title,
            // Make each orderId unique per product
            orderId: `${reviewTemplate.orderId}-${product._id.toString().slice(-4)}`,
          });

          await review.save();
          reviewsAdded++;
          console.log(`   ✓ Added review by ${reviewTemplate.userName}`);
        } catch (error) {
          if (error.code === 11000) {
            reviewsSkipped++;
            console.log(`   ⚠ Review already exists, skipping...`);
          } else {
            console.error(`   ✗ Error adding review: ${error.message}`);
          }
        }
      }

      // Update product rating and review count
      const stats = await Review.aggregate([
        {
          $match: {
            productId: product._id,
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

        await Product.findByIdAndUpdate(product._id, {
          rating,
          reviewCount,
        });

        console.log(
          `   ⭐ Updated product: ${rating} stars (${reviewCount} reviews)`
        );
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ Dummy reviews added successfully!`);
    console.log(`   Total reviews added: ${reviewsAdded}`);
    console.log(`   Reviews skipped (duplicates): ${reviewsSkipped}`);
    console.log("=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the script
addDummyReviews();
