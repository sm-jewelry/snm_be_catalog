import express from "express";
import * as trendingController from "../controllers/trending.controller.js";

const router = express.Router();

// Get trending products grouped by collection
router.get("/by-collection", trendingController.getTrendingProductsByCollection);

// Get all trending products
router.get("/", trendingController.getAllTrending);

export default router;
