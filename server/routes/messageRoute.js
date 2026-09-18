import express from "express";
import {
  sendMessage,
  getConversation,
} from "../controllers/MessageController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/", protect, sendMessage);

router.get("/:userId", protect, getConversation);

export default router;
