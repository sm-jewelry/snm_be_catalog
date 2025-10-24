import express from "express";
import * as newArrivalController from "../controllers/newArrival.controller.js";

const router = express.Router();

// GET /api/new-arrivals
router.get("/", newArrivalController.getNewArrivals);

export default router;
