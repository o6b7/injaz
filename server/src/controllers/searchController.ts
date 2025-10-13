import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const search = async (req: Request, res: Response): Promise<void> => {
  const query = (req.query.query as string)?.trim();

  try {
    const [tasks, projects, users] = await Promise.all([
      prisma.task.findMany({ where: { OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]}}),
      prisma.project.findMany({ where: { OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]}}),
      prisma.user.findMany({ where: { OR: [
        { username: { contains: query, mode: "insensitive" } },
      ]}}),
    ]);
    res.json({ tasks, projects, users });
  } catch (err: any) {
    res.status(500).json({ message: "Error performing search: " + err.message });
  }
};
