import express from "express";
import * as productController from "../controllers/product.controller.js";
import { verifyAuth, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/collection/:collectionId", productController.getProductsByCollection);
router.get("/:id", productController.getProduct);
router.post("/", verifyAuth, authorize(["admin"]), productController.createProduct);
router.put("/:id", verifyAuth, authorize(["admin"]), productController.updateProduct);
router.delete("/:id", verifyAuth, authorize(["admin"]), productController.deleteProduct);
router.get("/", productController.getAllProducts);

export default router;
