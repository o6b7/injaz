import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response) : Promise<void> => {
    const {projectId} = req.query;
    
    if (isNaN(Number(projectId))) {
        res.status(400).json({ success: false, message: "Invalid project ID" });
        return;
    }

    try {
        const tasks = await prisma.task.findMany({
            where: {
                projectId: Number(projectId),
            },
            include: {
                author: true,
                assignee: true,
                comments: true, 
                attachments: true,
            }
        })

        tasks.length < 1 ? 
        res.status(500).json({ success: false, message: "No tasks for the chosen project"} ): 
        res.json({ success: true, tasks });

    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error fetching tasks: " + error.message} )
    }
}

export const createTask = async (req: Request, res: Response) : Promise<void> => {
    const { title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId } = req.body;

    try {
        const newTask = await prisma.task.create({
            data: { title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId }
        })
        res.status(201).json({ success: true, newTask })
    } catch (error: any) {
        res.status(500).json({ success: false, message: `Error creating task: ${error.message}`} )
    }
}

