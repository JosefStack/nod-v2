import { prisma } from "../../lib/prisma.ts";
import { AuthRequest } from "../../middleware/auth.middleware.ts";
import { Response } from "express";

const getAllDirectChats = async (req: AuthRequest, res: Response) => {

    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

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
                                avatar: true,
                            }
                        },
                        attachments: {
                            select: {
                                type: true,
                            }
                        }

                    }
                }
            }
        });
    } catch (err: any) {
        throw new Error(err.message || "Failed to fetch direct chats")
    }
};

export default getAllDirectChats;