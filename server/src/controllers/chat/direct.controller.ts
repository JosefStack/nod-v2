import { Response } from "express";
import { prisma } from "../../lib/prisma.ts";
import { AuthRequest } from "../../middleware/auth.middleware.ts";


export const getAllDirectChats = async (id: string) => {

    try {
        const userId = id;

        const directChats = await prisma.directChat.findMany({
            where: {
                participants: {
                    some: { userId }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                                name: true,
                                image: true,
                            }
                        }
                    }
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        content: true,
                        createdAt: true,
                        updatedAt: true,
                        sender: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                            }
                        },
                        attachments: {
                            select: {
                                type: true,
                            }
                        }
                    },
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                NOT: { senderId: userId },
                                readBy: {
                                    none: { userId }
                                }
                            }
                        }
                    }
                }
            }
        });



        const formattedDirectChats = directChats.map((chat: any) => {

            const otherParticipant = chat.participants.find((participant: any) => participant.userId !== userId)?.user;
            const lastMessage = chat.messages[0] || null;

            const attachments = lastMessage.attachments || [];

            let preview = lastMessage?.content || null;

            if (!preview && attachments.length > 0) {
                const hasImage = attachments.some((attachment: any) => attachment.type === "image")
                const hasVideo = attachments.some((attachment: any) => attachment.type === "video")

                if (hasImage && hasVideo) {
                    preview = `🔗${attachments.length} attachments`
                } else if (hasImage) {
                    preview = `📸${attachments.length} image${attachments.length > 1 ? 's' : ''}`
                } else if (hasVideo) {
                    preview = `🎬${attachments.length} video${attachments.length > 1 ? 's' : ''}`
                } else {
                    preview = `🔗${attachments.length} attachment${attachments.length > 1 ? 's' : ''}`
                }
            }

            return {
                id: chat.id,
                type: "direct",
                name: otherParticipant.name,
                username: otherParticipant.username,
                avatar: otherParticipant.avatar,
                lastMessage: {
                    preview,
                    createdAt: lastMessage.createdAt,
                    updatedAt: lastMessage.updatedAt,
                    sender: lastMessage.sender.username,
                },
                unreadCount: chat._count.messages,
            }
        });


        return formattedDirectChats;
    } catch (err: any) {
        throw new Error(err.message || "Failed to fetch direct chats")
    }
};

export const getOrCreateDirectChat = async (req: AuthRequest, res: Response) => {

    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { targetUserId } = req.body;
        if (!targetUserId) return res.status(404).json({ message: "User not found" });
        if (targetUserId === userId) return res.status(400).json({ message: "Cannot chat with yourself" })

        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: { id: true, username: true, name: true, avatar: true }
        });
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        // check for existing direct chats
        const existingDirectChat = await prisma.directChat.findUnique({
            where: {
                AND: [
                    { participants: { some: { userId } } },
                    { participatns: { some: { userId: targetUserId } } }
                ]
            }
        });
        
        if (existingDirectChat) {
            return res.status(200).json({
                id: existingDirectChat.id,
                type: "direct",
                isNew: false,
                other: targetUser,
            });
        };

        const newChat = await prisma.directChat.create({
            data: {
                participants: {
                    create: [
                        { userId }, 
                        { userId: targetUserId }
                    ]
                }
            }
        });

        return res.status(201).json({
            id: newChat.id,
            type: "direct",
            isNew: true,
            other: targetUser,
        })



    } catch (err: any) {
        console.error(err || "error creating chat or fetching existing chat")
        return res.status(500).json({ message: "Failed to create direct chat" })
    } 


}

