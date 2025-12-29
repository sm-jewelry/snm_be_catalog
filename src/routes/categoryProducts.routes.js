import express from "express";
import * as categoryProductsController from "../controllers/categoryProducts.controller.js";

const router = express.Router();

// Get category hierarchy (C1 -> C2 -> C3)
router.get("/hierarchy", categoryProductsController.getCategoryHierarchy);

// Get breadcrumb path for a category
router.get("/path/:categoryId", categoryProductsController.getCategoryPath);

// Get products by category ID
router.get("/:categoryId", categoryProductsController.getProductsByCategory);

export default router;
