import { Response } from "express";
import { prisma } from "../../lib/prisma.ts";
import { AuthRequest } from "../../middleware/auth.middleware.ts";
import cloudinary from "../../lib/cloudinary.ts";

export const getAllGroupChats = async (id: String) => {
    try {
        const userId = id;

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
        });


        const formattedGroupChats = groupChats.map((chat: any) => {

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
                type: "group",
                name: chat.name,
                avatar: chat.avatar,
                lastMessage: {
                    preview,
                    createdAt: lastMessage.createdAt,
                    updatedAt: lastMessage.updatedAt,
                    sender: lastMessage.sender.username
                },
                unreadCount: chat._count.messages,
            }
        })

        return formattedGroupChats;
    } catch (err: any) {
        throw new Error(err.message || "Failed to fetch group chats")
    }
}

export const createGroup = async (req: AuthRequest, res: Response) => {
    try {

        const userId = req.user?.id;
        if (!userId) return res.status(401).json({message: "Unauthorized"});

        const { groupName, groupAvatar, groupDescription, memberIds } = req.body;

        if (!groupName.trim()) return res.status(400).json({ message: "Group name is required" });
        if (!memberIds || memberIds.length === 0) return res.status(400).json({ message: "Add at least one member" });

        let groupAvatarUrl: string | null = null;
        if (groupAvatar) {
            const result = await cloudinary.uploader.upload(groupAvatar, {
                fodler: "nod/groups",
                transformation: [{ width: 200, height: 200, crop: "fill" }],
            });
            groupAvatarUrl = result.secure_url;
        };

        // check if added members are valid
        const validUsers = await prisma.user.findMany({
            where: {
                id: { in: memberIds }
            },
            select: { id: true },
        });
        const validIds = validUsers.map((user: any) => user.id);

        // creator is also a member...
        const allMemberIds = [... new Set([...validIds, userId])];

        const newGroup = await prisma.group.create({
            name: groupName, 
            avatar: groupAvatar,
            description: groupDescription || null,
            ownerid: userId,
            members: {
                create: allMemberIds.map((id: string) => ({
                    userId: id,
                    role: id === userId ? "owner" : "member"
                }))
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true, name: true, username: true, avatar: true,
                            }
                        }
                    }
                }
            }
        });

        return res.status(201).json({
            id: newGroup.id,
            name: newGroup.name,
            description: newGroup.description || null,
            avatar: newGroup.avatar,
            members: newGroup.members.map((member: any) => ({
                ...member.user,
                role: member.role,
            })),
        });

    } catch (err: any) {
        console.error("Failed to create group: ", err);
        return res.status(500).json({ message: "Failed to create group" })
    }
}