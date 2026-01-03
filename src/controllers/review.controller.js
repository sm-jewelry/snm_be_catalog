import * as reviewService from "../services/review.service.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

/**
 * Create a new review
 * POST /api/reviews
 */
export const createReview = async (req, res) => {
  try {
    // Extract user data from auth middleware
    const user = req.user;
    const userId = user._id || user.userId;
    const userName = `${user.firstName} ${user.lastName}`;
    const userEmail = user.email;

    const { productId, productTitle, orderId, rating, title, comment, images } =
      req.body;

    // Check if user can review
    const canReview = await reviewService.canUserReview(
      userId,
      productId,
      orderId
    );

    if (!canReview.canReview) {
      return res.status(400).json({ message: canReview.reason });
    }

    const reviewData = {
      userId,
      userName,
      userEmail,
      productId,
      productTitle,
      orderId,
      rating: parseInt(rating),
      title,
      comment,
      images: images || [],
      isVerifiedPurchase: true,
    };

    const review = await reviewService.createReview(reviewData);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully and pending approval",
      review,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "You have already reviewed this product for this order",
      });
    }
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get reviews for a product
 * GET /api/reviews/product/:productId
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page, limit, sortBy, sortOrder, status } = req.query;

    const result = await reviewService.getProductReviews(productId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sortBy: sortBy || "createdAt",
      sortOrder: sortOrder || "desc",
      status: status || "approved",
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get review statistics for a product
 * GET /api/reviews/product/:productId/stats
 */
export const getProductReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;
    const stats = await reviewService.getProductReviewStats(productId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get user's own reviews
 * GET /api/reviews/my-reviews
 */
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const { page, limit } = req.query;

    const result = await reviewService.getUserReviews(userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update user's own review
 * PUT /api/reviews/:id
 */
export const updateMyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.userId;
    const updateData = req.body;

    const review = await reviewService.updateReviewByUser(
      id,
      userId,
      updateData
    );

    res.json({
      success: true,
      message: "Review updated successfully and pending re-approval",
      review,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Delete user's own review
 * DELETE /api/reviews/:id
 */
export const deleteMyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.userId;

    const result = await reviewService.deleteReviewByUser(id, userId);

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Vote review as helpful/not helpful
 * POST /api/reviews/:id/vote
 */
export const voteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.userId;
    const { voteType } = req.body; // "helpful" or "notHelpful"

    if (!["helpful", "notHelpful"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const result = await reviewService.voteReviewHelpful(id, userId, voteType);

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Check if user can review a product
 * GET /api/reviews/user/can-review/:productId
 */
export const checkCanReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id || req.user.userId;

    const result = await reviewService.checkUserHasOrderedProduct(userId, productId);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * Admin: Get all reviews with filters
 * GET /api/reviews/admin/all
 */
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const filters = req.query;

    const result = await reviewService.getAllReviews(filters);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Admin: Approve review
 * POST /api/reviews/admin/:id/approve
 */
export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.userId;

    const review = await reviewService.approveReview(id, userId);

    res.json({
      success: true,
      message: "Review approved successfully",
      review,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Admin: Reject review
 * POST /api/reviews/admin/:id/reject
 */
export const rejectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.userId;
    const { reason } = req.body;

    const review = await reviewService.rejectReview(id, userId, reason);

    res.json({
      success: true,
      message: "Review rejected successfully",
      review,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Admin: Update review
 * PUT /api/reviews/admin/:id
 */
export const updateReviewAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.userId;
    const updateData = req.body;

    const review = await reviewService.updateReviewByAdmin(
      id,
      updateData,
      userId
    );

    res.json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Admin: Delete review
 * DELETE /api/reviews/admin/:id
 */
export const deleteReviewAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await reviewService.deleteReviewByAdmin(id);

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Admin: Bulk import reviews from CSV
 * POST /api/reviews/admin/import
 */
export const bulkImportReviews = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV file" });
    }

    const fileContent = fs.readFileSync(req.file.path, "utf-8");
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Transform CSV data to review format
    const reviewsData = records.map((record) => ({
      userId: record.userId,
      userName: record.userName,
      userEmail: record.userEmail,
      productId: record.productId,
      productTitle: record.productTitle,
      orderId: record.orderId,
      rating: parseInt(record.rating),
      title: record.title,
      comment: record.comment,
      images: record.images ? record.images.split(",") : [],
      isVerifiedPurchase: record.isVerifiedPurchase === "true",
      status: record.status || "pending",
    }));

    const results = await reviewService.bulkImportReviews(reviewsData);

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `Import completed. Success: ${results.success}, Failed: ${results.failed}`,
      results,
    });
  } catch (err) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: err.message });
  }
};

/**
 * Admin: Export reviews to CSV
 * GET /api/reviews/admin/export
 */
export const exportReviews = async (req, res) => {
  try {
    const { status, productId } = req.query;

    const reviews = await reviewService.exportAllReviews({
      status,
      productId,
    });

    // Transform to CSV format
    const csvData = reviews.map((review) => ({
      _id: review._id,
      userId: review.userId,
      userName: review.userName,
      userEmail: review.userEmail,
      productId: review.productId,
      productTitle: review.productTitle,
      orderId: review.orderId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images.join(","),
      isVerifiedPurchase: review.isVerifiedPurchase,
      status: review.status,
      adminNotes: review.adminNotes || "",
      helpfulCount: review.helpfulCount,
      notHelpfulCount: review.notHelpfulCount,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    const csv = stringify(csvData, {
      header: true,
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reviews-${Date.now()}.csv`
    );
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Multer config for CSV upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads/csv";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `reviews-${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});
