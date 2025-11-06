import express from "express";
import * as productController from "../controllers/product.controller.js";
import { verifyOathkeeper } from "../middleware/oathkeeper.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/collection/:collectionId", productController.getProductsByCollection);
router.get("/:id", productController.getProduct);
router.post("/", verifyOathkeeper, authorize(["admin"]),productController.createProduct);
router.put("/:id",verifyOathkeeper, authorize(["admin"]), productController.updateProduct);
router.delete("/:id",verifyOathkeeper, authorize(["admin"]), productController.deleteProduct);
router.get("/", productController.getAllProducts);

export default router;
