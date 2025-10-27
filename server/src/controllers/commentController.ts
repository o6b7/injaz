import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Add a new comment to a task
 */
export const addCommentToTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { userSub, text } = req.body;

    // Basic validation
    if (!userSub || !text) {
      return res.status(400).json({
        success: false,
        message: "Both userSub and text are required.",
      });
    }

    const taskIdNum = Number(taskId);
    if (isNaN(taskIdNum)) {
      return res.status(400).json({
        success: false,
        message: "Invalid taskId parameter.",
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { cognitoId: userSub },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found for the provided userSub.",
      });
    }

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskIdNum },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        text,
        taskId: taskIdNum,
        userId: user.userId,
      },
      include: {
        user: {
          select: {
            username: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add comment.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get all comments for a given task
 */
export const getTaskComments = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const taskIdNum = Number(taskId);

    if (isNaN(taskIdNum)) {
      return res.status(400).json({
        success: false,
        message: "Invalid taskId parameter.",
      });
    }

    const comments = await prisma.comment.findMany({
      where: {
        taskId: taskIdNum,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        user: {
          select: {
            username: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: comments,
      count: comments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
