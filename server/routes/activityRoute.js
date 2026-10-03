import express from "express";
import {
  getActivities,
  createActivity,
} from "../controllers/ActivityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getActivities);
router.post("/", protect, createActivity);

export default router;
