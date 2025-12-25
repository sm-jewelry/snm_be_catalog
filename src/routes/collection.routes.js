import express from "express";
import * as collectionController from "../controllers/collection.controller.js";
import { verifyAuth, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", collectionController.getCollections);
router.get("/:id", collectionController.getCollection);
router.post("/", verifyAuth, authorize(["admin"]), collectionController.createCollection);
router.put("/:id", verifyAuth, authorize(["admin"]), collectionController.updateCollection);
router.delete("/:id", verifyAuth, authorize(["admin"]), collectionController.deleteCollection);

export default router;
