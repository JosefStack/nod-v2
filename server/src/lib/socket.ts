import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import { socketAuthMiddleware } from "../middleware/socket.middleware.js";
import { prisma } from "./prisma.js";

export const app = express();
export const server = createServer(app);

const allowedOrigins = [
    "http://localhost:5173",
    "https://nod-seven.vercel.app",
]

export const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log("Blocked by CORS: ", origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
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

    socket.on("call_user", ({ targetUserId, offer }: { targetUserId: string; offer: RTCSessionDescriptionInit }) => {
        const targetSocketId = getReceiverSocketId(targetUserId);
        if (!targetSocketId) {
            socket.emit("call_failed", { reason: "User is offline" });
            return;
        };

        io.to(targetSocketId).emit("incoming_call", {
            callerId: user.id,
            callerName: user.name || user.username,
            callerAvatar: user.avatar,
            offer,
        });
    });

    socket.on("call_accepted", ({ targetUserId, answer }: { targetUserId: string; answer: RTCSessionDescriptionInit }) => {
        const targetSocketId = getReceiverSocketId(targetUserId);
        if (!targetSocketId) return;
        io.to(targetSocketId).emit("call_accepted", { answer });
    })

    socket.on("call_rejected", ({ targetUserId }: { targetUserId: string }) => {
        const targetSocketId = getReceiverSocketId(targetUserId);
        if (!targetSocketId) return;
        io.to(targetSocketId).emit("call_rejected");
    });

    socket.on("ice_candidate", ({ targetUserId, candidate }: { targetUserId: string; candidate: RTCIceCandidateInit }) => {
        const targetSocketId = getReceiverSocketId(targetUserId);
        if (!targetSocketId) return;
        io.to(targetSocketId).emit("ice_candidate", { candidate });
    });

    socket.on("call_ended", ({ targetUserId }: { targetUserId: string }) => {
        const targetSocketId = getReceiverSocketId(targetUserId);
        if (!targetSocketId) return;
        io.to(targetSocketId).emit("call_ended");
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${user.username}`);
        userSocketMap.delete(user.id);
        io.emit("user_offline", user.id);
    });
});

const joinUserRooms = async (socket: Socket, userId: string, username: string) => {
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