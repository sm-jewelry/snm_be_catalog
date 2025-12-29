import express from "express";
import * as bestSellerController from "../controllers/bestSeller.controller.js";

const router = express.Router();

router.get("/", bestSellerController.getBestSellers);

export default router;
