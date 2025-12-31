import express from "express";
import * as reviewController from "../controllers/review.controller.js";
import { verifyAuth, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================
// PUBLIC ROUTES (no auth required)
// ============================================

// Get reviews for a product
router.get("/product/:productId", reviewController.getProductReviews);

// Get review statistics for a product
router.get("/product/:productId/stats", reviewController.getProductReviewStats);

// ============================================
// USER ROUTES (auth required)
// ============================================

// Create a review
router.post("/", verifyAuth, reviewController.createReview);

// Get user's own reviews
router.get("/my-reviews", verifyAuth, reviewController.getMyReviews);

// Update user's own review
router.put("/:id", verifyAuth, reviewController.updateMyReview);

// Delete user's own review
router.delete("/:id", verifyAuth, reviewController.deleteMyReview);

// Vote review as helpful/not helpful
router.post("/:id/vote", verifyAuth, reviewController.voteReview);

// Check if user can review a product
router.get("/user/can-review/:productId", verifyAuth, reviewController.checkCanReview);

// ============================================
// ADMIN ROUTES (auth + admin role required)
// ============================================

// Get all reviews (with filters)
router.get(
  "/admin/all",
  verifyAuth,
  authorize(["admin"]),
  reviewController.getAllReviewsAdmin
);

// Approve review
router.post(
  "/admin/:id/approve",
  verifyAuth,
  authorize(["admin"]),
  reviewController.approveReview
);

// Reject review
router.post(
  "/admin/:id/reject",
  verifyAuth,
  authorize(["admin"]),
  reviewController.rejectReview
);

// Update review (admin)
router.put(
  "/admin/:id",
  verifyAuth,
  authorize(["admin"]),
  reviewController.updateReviewAdmin
);

// Delete review (admin)
router.delete(
  "/admin/:id",
  verifyAuth,
  authorize(["admin"]),
  reviewController.deleteReviewAdmin
);

// Bulk import reviews from CSV
router.post(
  "/admin/import",
  verifyAuth,
  authorize(["admin"]),
  reviewController.upload.single("file"),
  reviewController.bulkImportReviews
);

// Export reviews to CSV
router.get(
  "/admin/export",
  verifyAuth,
  authorize(["admin"]),
  reviewController.exportReviews
);

export default router;
