import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { verifyOathkeeper } from "../middleware/oathkeeper.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// Only admin can create, update, delete
router.post("/", verifyOathkeeper, authorize(["admin"]), categoryController.createCategory);
router.put("/:id", verifyOathkeeper, authorize(["admin"]), categoryController.updateCategory);
router.delete("/:id", verifyOathkeeper, authorize(["admin"]), categoryController.deleteCategory);

// Both user and admin can read
router.get("/",  categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

// Get categories by level (C1, C2, C3)
// router.get(
//   "/level/:level",
//   verifyOathkeeper,
//   authorize(["admin", "user"]),
//   categoryController.getCategoriesByLevel
// );
router.get(
  "/level/:level",
  categoryController.getCategoriesByLevel
);

// Get products by C1 category ID
router.get(
  "/:id/products",
  categoryController.getProductsByC1
);

export default router;
