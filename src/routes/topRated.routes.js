import express from "express";
import * as topRatedController from "../controllers/topRated.controller.js";

const router = express.Router();

router.get("/", topRatedController.getTopRated);

export default router;
