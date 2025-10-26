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
 * Add a comment to a specific task
 * POST /api/tasks/:taskId/comments
 */
const addCommentToTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { userSub, text } = req.body;
        console.log("Received comment request:", { taskId, userSub, text });
        if (!userSub || !text) {
            return res.status(400).json({ message: "userSub and text are required." });
        }
        // البحث عن المستخدم باستخدام cognitoId (userSub)
        const user = yield prisma.user.findFirst({
            where: { cognitoId: userSub },
        });
        if (!user) {
            console.error("User not found for cognitoId:", userSub);
            return res.status(404).json({ message: "User not found in database." });
        }
        // Check if the task exists
        const task = yield prisma.task.findUnique({
            where: { id: Number(taskId) },
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }
        // Create the comment
        const comment = yield prisma.comment.create({
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
    }
    catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ message: "Failed to add comment.", error });
    }
});
exports.addCommentToTask = addCommentToTask;
/**
 * Get all comments for a specific task
 * GET /api/tasks/:taskId/comments
 */
const getTaskComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const comments = yield prisma.comment.findMany({
            where: { taskId: Number(taskId) },
            orderBy: { id: "asc" },
            include: {
                user: {
                    select: { username: true, profilePictureUrl: true },
                },
            },
        });
        return res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Failed to fetch comments.", error });
    }
});
exports.getTaskComments = getTaskComments;
