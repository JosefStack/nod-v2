import { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import { getAllDirectChats } from "./chat/direct.controller.ts";
import getAllGroupChats from "./chat/group.controller.ts";



export const getAllChats = async (req: AuthRequest, res: Response) => {

    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const directChats = await getAllDirectChats(userId);
        const groupChats = await getAllGroupChats(userId);

        const allChats = [...directChats, ...groupChats];

        allChats.sort((a: any, b: any) => {
            const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        return res.status(200).json(allChats);

    } catch (err: any) {
        return res.status(500).json({ message: err.message || "Failed to fetch chats" });
    }
}



export const getAllRooms = (req: AuthRequest, res: Response) => {
    return res.status(404).json({ message: "Chiseling" })
}