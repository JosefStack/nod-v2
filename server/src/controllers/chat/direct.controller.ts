import { prisma } from "../../lib/prisma.ts";


const getAllDirectChats = async (id: String) => {

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

export default getAllDirectChats;