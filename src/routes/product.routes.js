import express from "express";
import * as productController from "../controllers/product.controller.js";

const router = express.Router();

router.get("/collection/:collectionId", productController.getProductsByCollection);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
