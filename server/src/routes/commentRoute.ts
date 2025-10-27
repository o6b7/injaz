import express from "express";
import { addCommentToTask, getTaskComments } from "../controllers/commentController";

const router = express.Router();

router.post("/:taskId/comments", addCommentToTask);
router.get("/:taskId/comments", getTaskComments);

export default router;