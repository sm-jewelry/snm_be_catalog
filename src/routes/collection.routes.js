import express from "express";
import * as collectionController from "../controllers/collection.controller.js";

const router = express.Router();

router.get("/", collectionController.getCollections);
router.get("/:id", collectionController.getCollection);
router.post("/", collectionController.createCollection);
router.put("/:id", collectionController.updateCollection);
router.delete("/:id", collectionController.deleteCollection);

export default router;
