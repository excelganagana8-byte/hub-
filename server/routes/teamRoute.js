import express from "express";
import {
  createTeam,
  getTeams,
  getTeamById,
} from "../controllers/TeamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTeams);

router.post("/", protect, createTeam);

router.get("/:teamId", protect, getTeamById);

export default router;
