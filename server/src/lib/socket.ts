import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { socketAuthMiddleware } from "../middleware/socket.middleware.js";
import { prisma } from "./prisma.js";

export const app = express();
export const server = createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    },
});

const userSocketMap = new Map<string, string>();

export const getReceiverSocketId = (userId: string) => {
    return userSocketMap.get(userId);
};

export const getOnlineUsers = () => {
    return Array.from(userSocketMap.keys());
};

io.use(socketAuthMiddleware);

io.on("connection", async (socket) => {
    const user = socket.data.user;
    console.log(`User connected: ${user.username}`);

    userSocketMap.set(user.id, socket.id);

    await joinUserRooms(socket, user.id, user.username);

    io.emit("user_online", user.id);
    socket.emit("online_users", Array.from(userSocketMap.keys()));

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${user.username}`);
        userSocketMap.delete(user.id);
        io.emit("user_offline", user.id);
    });
});

const joinUserRooms = async (socket: any, userId: string, username: string) => {
    try {
        const [directChats, groups] = await Promise.all([
            prisma.directChat.findMany({
                where: { participants: { some: { userId } } },
                select: { id: true },
            }),
            prisma.group.findMany({
                where: { members: { some: { userId } } },
                select: { id: true },
            }),
        ]);

        const roomIds = [
            ...directChats.map((c) => c.id),
            ...groups.map((g) => g.id),
        ];

        socket.join(roomIds);
        console.log(`${username} joined ${roomIds.length} rooms`);
    } catch (err) {
        console.error("Failed to join rooms:", err);
    }
};