import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Add a comment to a specific task
 * POST /api/tasks/:taskId/comments
 */
export const addCommentToTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { userSub, text } = req.body;

    console.log("Received comment request:", { taskId, userSub, text });

    if (!userSub || !text) {
      return res.status(400).json({ message: "userSub and text are required." });
    }

    // البحث عن المستخدم باستخدام cognitoId (userSub)
    const user = await prisma.user.findFirst({
      where: { cognitoId: userSub },
    });

    if (!user) {
      console.error("User not found for cognitoId:", userSub);
      return res.status(404).json({ message: "User not found in database." });
    }

    // Check if the task exists
    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        text,
        taskId: Number(taskId),
        userId: user.userId,
      },
      include: {
        user: {
          select: { username: true, profilePictureUrl: true },
        },
      },
    });

    console.log("Comment created successfully:", comment);
    return res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ message: "Failed to add comment.", error });
  }
};

/**
 * Get all comments for a specific task
 * GET /api/tasks/:taskId/comments
 */
export const getTaskComments = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { taskId: Number(taskId) },
      orderBy: { id: "asc" },
      include: {
        user: {
          select: { username: true, profilePictureUrl: true },
        },
      },
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Failed to fetch comments.", error });
  }
};