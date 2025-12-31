import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Catalog from "../models/catalog.model.js";

/**
 * Create a new review
 * Note: Order delivery verification should be done at API Gateway or in controller
 */
export const createReview = async (reviewData) => {
  const review = new Review(reviewData);
  const savedReview = await review.save();

  // Update product rating and review count
  await updateProductRating(reviewData.productId);

  return savedReview;
};

/**
 * Get reviews for a product
 */
export const getProductReviews = async (productId, options = {}) => {
  const {
    status = "approved",
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const query = { productId };
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [reviews, total] = await Promise.all([
    Review.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Review.countDocuments(query),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get review statistics for a product
 */
export const getProductReviewStats = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        productId: productId,
        status: "approved",
      },
    },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);

  if (stats.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const stat = stats[0];

  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  stat.ratingDistribution.forEach((rating) => {
    distribution[rating] = (distribution[rating] || 0) + 1;
  });

  return {
    averageRating: Math.round(stat.averageRating * 10) / 10,
    totalReviews: stat.totalReviews,
    ratingDistribution: distribution,
  };
};

/**
 * Get user's reviews
 */
export const getUserReviews = async (userId, options = {}) => {
  const { page = 1, limit = 10 } = options;

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments({ userId }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update review by user
 */
export const updateReviewByUser = async (reviewId, userId, updateData) => {
  const review = await Review.findOne({ _id: reviewId, userId });

  if (!review) {
    throw new Error("Review not found or you don't have permission");
  }

  // User can only update rating, title, comment, images
  const allowedUpdates = ["rating", "title", "comment", "images"];
  Object.keys(updateData).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      review[key] = updateData[key];
    }
  });

  // Reset to pending if review was modified
  if (review.status === "approved") {
    review.status = "pending";
  }

  const updated = await review.save();

  // Update product rating
  await updateProductRating(review.productId);

  return updated;
};

/**
 * Delete review by user
 */
export const deleteReviewByUser = async (reviewId, userId) => {
  const review = await Review.findOne({ _id: reviewId, userId });

  if (!review) {
    throw new Error("Review not found or you don't have permission");
  }

  const productId = review.productId;
  await Review.deleteOne({ _id: reviewId });

  // Update product rating
  await updateProductRating(productId);

  return { message: "Review deleted successfully" };
};

/**
 * Admin: Get all reviews with filters
 */
export const getAllReviews = async (filters = {}) => {
  const {
    status,
    rating,
    productId,
    userId,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const query = {};
  if (status) query.status = status;
  if (rating) query.rating = parseInt(rating);
  if (productId) query.productId = productId;
  if (userId) query.userId = userId;

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [reviews, total] = await Promise.all([
    Review.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Review.countDocuments(query),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Admin: Approve review
 */
export const approveReview = async (reviewId, adminId) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      status: "approved",
      moderatedBy: adminId,
      moderatedAt: new Date(),
      $unset: { adminNotes: "" },
    },
    { new: true }
  );

  if (!review) {
    throw new Error("Review not found");
  }

  // Update product rating
  await updateProductRating(review.productId);

  return review;
};

/**
 * Admin: Reject review
 */
export const rejectReview = async (reviewId, adminId, reason) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      status: "rejected",
      adminNotes: reason,
      moderatedBy: adminId,
      moderatedAt: new Date(),
    },
    { new: true }
  );

  if (!review) {
    throw new Error("Review not found");
  }

  // Update product rating
  await updateProductRating(review.productId);

  return review;
};

/**
 * Admin: Update review
 */
export const updateReviewByAdmin = async (reviewId, updateData, adminId) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      ...updateData,
      moderatedBy: adminId,
      moderatedAt: new Date(),
    },
    { new: true }
  );

  if (!review) {
    throw new Error("Review not found");
  }

  // Update product rating if rating changed
  if (updateData.rating !== undefined) {
    await updateProductRating(review.productId);
  }

  return review;
};

/**
 * Admin: Delete review
 */
export const deleteReviewByAdmin = async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  const productId = review.productId;
  await Review.deleteOne({ _id: reviewId });

  // Update product rating
  await updateProductRating(productId);

  return { message: "Review deleted successfully" };
};

/**
 * Check if user can review a product
 * (User must have a delivered order with this product)
 */
export const canUserReview = async (userId, productId, orderId) => {
  // Check if user already reviewed this product for this order
  const existingReview = await Review.findOne({ userId, productId, orderId });

  if (existingReview) {
    return {
      canReview: false,
      reason: "You have already reviewed this product for this order",
    };
  }

  // Note: Order delivery verification should be done at API Gateway
  // since orders are in a different service

  return {
    canReview: true,
  };
};

/**
 * Check if user has ordered a product (simplified version for UI)
 * Returns true if user is authenticated (actual order check happens at review submission)
 */
export const checkUserHasOrderedProduct = async (userId, productId) => {
  // For now, we allow showing the review button if user is logged in
  // Actual order verification will happen when they try to submit the review
  // This is because order data is in a different microservice

  return {
    canReview: true,
    hasOrdered: true,
  };
};

/**
 * Mark review as helpful/not helpful
 */
export const voteReviewHelpful = async (reviewId, userId, voteType) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Check if user already voted
  const existingVoteIndex = review.helpfulVotes.findIndex(
    (v) => v.userId === userId
  );

  if (existingVoteIndex > -1) {
    const existingVote = review.helpfulVotes[existingVoteIndex].vote;
    // Remove old vote count
    if (existingVote === "helpful") {
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      review.notHelpfulCount = Math.max(0, review.notHelpfulCount - 1);
    }

    // Update or remove vote
    if (existingVote === voteType) {
      // Remove vote if same type
      review.helpfulVotes.splice(existingVoteIndex, 1);
    } else {
      // Change vote
      review.helpfulVotes[existingVoteIndex].vote = voteType;
      if (voteType === "helpful") {
        review.helpfulCount++;
      } else {
        review.notHelpfulCount++;
      }
    }
  } else {
    // Add new vote
    review.helpfulVotes.push({ userId, vote: voteType });
    if (voteType === "helpful") {
      review.helpfulCount++;
    } else {
      review.notHelpfulCount++;
    }
  }

  await review.save();

  return {
    helpfulCount: review.helpfulCount,
    notHelpfulCount: review.notHelpfulCount,
  };
};

/**
 * Update product rating and review count based on approved reviews
 */
const updateProductRating = async (productId) => {
  try {
    const stats = await Review.aggregate([
      {
        $match: {
          productId: productId,
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

    const rating = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
    const reviewCount = stats.length > 0 ? stats[0].totalReviews : 0;

    // Try to update Product first
    const productUpdate = await Product.findByIdAndUpdate(productId, {
      rating,
      reviewCount,
    });

    // If not found in Product, try Catalog
    if (!productUpdate) {
      await Catalog.findByIdAndUpdate(productId, {
        rating,
        reviewCount,
      });
    }
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
};

/**
 * Bulk import reviews from array
 */
export const bulkImportReviews = async (reviewsData) => {
  const results = {
    success: 0,
    failed: 0,
    errors: [],
  };

  for (const reviewData of reviewsData) {
    try {
      await createReview(reviewData);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        data: reviewData,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Export all reviews to array
 */
export const exportAllReviews = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.productId) query.productId = filters.productId;

  const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();

  return reviews;
};
