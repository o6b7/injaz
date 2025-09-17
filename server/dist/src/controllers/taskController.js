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
exports.getTasks = void 0;
const client_1 = require("@prisma/client");
const validateId_1 = require("../utils/validateId");
const prisma = new client_1.PrismaClient();
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = (0, validateId_1.validateId)(req.query, "projectId");
    if (!validation.valid) {
        res.status(400).json({ success: false, message: validation.message });
        return;
    }
    const projectId = validation.value;
    try {
        const tasks = yield prisma.task.findMany({
            where: { projectId },
            include: { author: true, assignee: true, comments: true, attachments: true }
        });
        tasks.length < 1
            ? res.status(404).json({ success: false, message: "No tasks for the chosen project" })
            : res.json({ success: true, tasks });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching tasks: " + error.message });
    }
});
exports.getTasks = getTasks;
