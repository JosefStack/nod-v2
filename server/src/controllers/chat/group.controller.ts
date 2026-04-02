import { prisma } from "../../lib/prisma.ts";

const getAllGroupChats = async (id: String) => {
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

            const lastMessage = chat.messages[0];

            const attachments = lastMessage.attachments || [];

            let preview = lastMessage.content;

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

export default getAllGroupChats;