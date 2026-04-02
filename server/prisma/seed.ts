// server/prisma/seed.ts
import { prisma } from '../src/lib/prisma.js';

async function seed() {
    try {
        console.log("🌱 Starting seed...");

        const userId = "2734d64b-1599-400a-88d1-22eab0f3f47d"; // tester
        const friendId = "3ded5adb-8555-4a70-88a4-526a742920a2"; // friend

        // Get or create direct chat
        let directChat = await prisma.directChat.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId } } },
                    { participants: { some: { userId: friendId } } }
                ]
            }
        });

        if (!directChat) {
            directChat = await prisma.directChat.create({
                data: {
                    participants: {
                        create: [
                            { userId },
                            { userId: friendId }
                        ]
                    }
                }
            });
            console.log(`✅ Created direct chat`);
        }

        // Clear existing messages
        await prisma.message.deleteMany({
            where: { directChatId: directChat.id }
        });

        // Scenario 1: Normal conversation (all read)
        // Message 1: You ask a question
        const msg1 = await prisma.message.create({
            data: {
                content: "Hey! How are you?",
                senderId: userId,
                directChatId: directChat.id,
            }
        });

        // Mark as read by you (you sent it, so it's automatically "read" by you)
        await prisma.messageRead.create({
            data: { messageId: msg1.id, userId }
        });

        // Message 2: Friend replies (unread)
        const msg2 = await prisma.message.create({
            data: {
                content: "I'm good! Thanks for asking!",
                senderId: friendId,
                directChatId: directChat.id,
            }
        });
        // ❌ No read receipt — this is unread

        // Message 3: You reply again (but you haven't read friend's message!)
        // This is the unrealistic part — let's fix it

        // Instead, let's create a realistic scenario:
        // - Friend sends a message
        // - You read it
        // - Then you reply

        // So let's mark msg2 as read
        await prisma.messageRead.create({
            data: { messageId: msg2.id, userId }
        });

        // Then you reply
        await prisma.message.create({
            data: {
                content: "Want to chat later?",
                senderId: userId,
                directChatId: directChat.id,
            }
        });

        console.log(`✅ Created realistic conversation (all read)`);

        // Scenario 2: Create an unread message (for testing badge)
        const unreadMsg = await prisma.message.create({
            data: {
                content: "Hey! Check this out!",
                senderId: friendId,
                directChatId: directChat.id,
            }
        });
        // ❌ No read receipt — this remains unread

        console.log(`✅ Added 1 unread message for testing badge`);

        console.log("🎉 Seed completed!");
        
    } catch (error) {
        console.error("❌ Seed failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();