import { prisma } from "../../lib/prisma.ts";
import { AuthRequest } from "../../middleware/auth.middleware.ts";
import { Response } from "express";


const getAllGroupChats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const groupChats = await prisma.group.findMany({
            where: {
                members: {
                    some: { userId }
                }
            }, 
            select: {
                id: true,
                name: true,
                avatar: true,
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
                    }
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                NOT: {senderId : userId},
                                readBy: {
                                    none: { userId }
                                }
                            }
                        }
                    }
                }
            }
        })


    } catch (err: any) {
        throw new Error(err.message || "Failed to fetch group chats")
    }
}

export default getAllGroupChats;