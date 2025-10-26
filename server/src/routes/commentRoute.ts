import express from "express";
import { addCommentToTask, getTaskComments } from "../controllers/commentController";

const router = express.Router();

router.post("/:taskId", addCommentToTask);
router.get("/:taskId", getTaskComments);

export default router;