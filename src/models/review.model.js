import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // User who wrote the review
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },

    // Product being reviewed
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    productTitle: {
      type: String,
      required: true,
    },

    // Order reference (to verify delivery)
    orderId: {
      type: String,
      required: true,
    },

    // Review content
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    // Review images (optional)
    images: [
      {
        type: String,
      },
    ],

    // Verification
    isVerifiedPurchase: {
      type: Boolean,
      default: true,
    },

    // Moderation status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // Admin moderation
    adminNotes: {
      type: String,
      maxlength: 500,
    },
    moderatedBy: {
      type: String,
    },
    moderatedAt: {
      type: Date,
    },

    // Helpfulness tracking
    helpfulCount: {
      type: Number,
      default: 0,
    },
    notHelpfulCount: {
      type: Number,
      default: 0,
    },

    // User interactions
    helpfulVotes: [
      {
        userId: String,
        vote: { type: String, enum: ["helpful", "notHelpful"] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
reviewSchema.index({ productId: 1, status: 1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Compound index for unique review per user per order
reviewSchema.index({ userId: 1, orderId: 1, productId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
