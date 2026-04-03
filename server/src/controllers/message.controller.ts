import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import { prisma } from "../lib/prisma.ts";




export const getAllMessages = async (req: AuthRequest, res: Response) => {

    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { chatId } = req.params;
        const { type } = req.query;

        if (!type) return res.json(400).json({ message: "type query param required" });

        const where = 
            type === "direct" ? { directChatId: chatId } :
            type === "group" ? { groupChatId: chatId } :
            type === "room" ? { roomChatId: chatId } :
            null;

        if (!where) return res.status(400).json({ message: "Invalid chat type" });

        const messages = await prisma.message.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true, username: true, avatar: true, name: true
                    }
                }, 
                attachments: true,
                readBy: {
                    select: { userId: true }
                }
            }
        });

        return res.status(200).json(messages);

    } catch (err: any) {
        console.error("Failed to fetch messages: ", err);
        return res.status(500).json({ message: "Failed to fetch messages" });
    }
}


export const sendMessage = (req: AuthRequest, res: Response) => {}






export const deleteMessage = (req: AuthRequest, res: Response) => {}