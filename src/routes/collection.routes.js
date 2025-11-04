import express from "express";
import * as collectionController from "../controllers/collection.controller.js";
import { verifyOathkeeper } from "../middleware/oathkeeper.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", collectionController.getCollections);
router.get("/:id", collectionController.getCollection);
router.post("/",verifyOathkeeper, authorize(["admin"]), collectionController.createCollection);
router.put("/:id",verifyOathkeeper, authorize(["admin"]), collectionController.updateCollection);
router.delete("/:id",verifyOathkeeper, authorize(["admin"]), collectionController.deleteCollection);

export default router;
