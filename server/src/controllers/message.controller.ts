import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import { prisma } from "../lib/prisma.ts";
import cloudinary from "../lib/cloudinary.ts";




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

const verifyMembership = async (userId: string, chatId: string, chatType: string) => {
    if (chatType === "direct") {
        const participant = await prisma.directChatParticipants.findFirst({
            where: {
                chatId, userId
            }
        });
        return !!participant;
    }

    if (chatType === "group") {
        const participant = await prisma.groupMember.findFirst({
            where: {
                chatId, userId
            }
        });
        return !!participant;
    }

    if (chatType === "room") {
        const participant = await prisma.roomMember.findFirst({
            where: {
                chatId, userId
            }
        });
        return !!participant;
    }
};


export const sendMessage = async (req: AuthRequest, res: Response) => {

    try {

        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { content, attachments, chatType, chatId } = req.body;

        if (!content.trim() && (!attachments || attachments.length === 0)) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        if (!chatId || !chatType) {
            return res.status(400).json({ message: "chatId and chatType is are requried" });
        }

        // check if sender (user) is a member of the provided chat
        const isMember = await verifyMembership(userId, chatId, chatType);
        if (!isMember) return res.status(403).json({ message: "You are not a part of this chat" });

        let uplaodedAttachments: any[] = [];
        if (attachments && attachments.length > 0) {
            const upload = await Promise.all(
                attachments.map(async (attachment: { data: string, type: string, fileName?: string, size?: number }) => {
                    const result = await cloudinary.uploader.upload(attachment.data, {
                        folder: attachment.type === "video" ? "nod/videos" : attachment.type === "image" ? "nod/images" : "nod/files",
                        resource_type: attachment.type === "video" ? "video" : attachment.type === "image" ? "image" : "raw",
                    });

                    return {
                        url: result.secure_url,
                        type: attachment.type,
                        fiNename: attachment.fileName || null,
                        size: attachment.size || null,
                        width: result.width || null,
                        height: result.height || null,
                        duration: result.duration || null,

                    };
                })
            );

            uplaodedAttachments = upload;
        }

        const chatRelation =
            chatType === "direct" ? { directChatId: chatId } :
                chatType === "group" ? { groupId: chatId } :
                    chatType === "room" ? { roomId: chatId } :
                        null;

        if (!chatRelation) return res.status(400).json({ message: "Invalid chat type" });

        //  content, attachments, chatType, chatId
        const message = await prisma.message.create({
            data: {
                content: content?.trim() || null,
                senderId: userId,
                ...chatRelation,
                attachments: {
                    create: uplaodedAttachments
                }
            }, 
            include: {
                sender: {
                    select: { id: true, name: true, avatar: true, username: true }
                }, 
                attachments: true
            }
        });

        return res.json(201).json(message);


    } catch (err: any) {
        console.log("Failed to send message: ", err)
        return res.status(500).json({ message: "Failed to send message" })
    }

};







export const deleteMessage = async (req: AuthRequest, res: Response) => {

    try {

        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { messageId } = req.params;
        if (!messageId) return res.status(400).json({ message: "messageId is requried" });

        const message = await prisma.message.findFirst({
            where: { id: messageId }, 
            select: { senderId: true }
        });

        if (!message) return res.status(404).json({ message: "Message not found" });
        if (message.senderId !== userId) return res.status(403).json({ message: "Cannot delete someone else's message" });
        
        await prisma.message.delete({ where: { id: messageId } });

        return res.status(200).json({ message: "Message deleted" });

    } catch (err: any) {
        console.error("Failed to delete message: ", err);
        return res.status(500).json({ message: "Failed to delete message" });
    }

}