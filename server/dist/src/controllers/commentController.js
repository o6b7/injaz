"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskComments = exports.addCommentToTask = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Add a new comment to a task
 */
const addCommentToTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield prisma.user.findUnique({
            where: { cognitoId: userSub },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found for the provided userSub.",
            });
        }
        // Check if task exists
        const task = yield prisma.task.findUnique({
            where: { id: taskIdNum },
        });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found.",
            });
        }
        // Create comment
        const comment = yield prisma.comment.create({
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
    }
    catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add comment.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.addCommentToTask = addCommentToTask;
/**
 * Get all comments for a given task
 */
const getTaskComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const taskIdNum = Number(taskId);
        if (isNaN(taskIdNum)) {
            return res.status(400).json({
                success: false,
                message: "Invalid taskId parameter.",
            });
        }
        const comments = yield prisma.comment.findMany({
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
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch comments.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getTaskComments = getTaskComments;
