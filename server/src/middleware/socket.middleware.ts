import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";


export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {

    try {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers.cookie
                ?.split("; ")
                .find((row) => row.startsWith("jwt="))
                ?.split("=")[1];

        if (!token) {
            console.log("Socket rejected: no token");
            return next(new Error("Unauthorized"));
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, username: true, avatar: true }
        })

        if (!user) {
            console.log("Socket rejected: user not found");
            return next(new Error("Unauthorized"));
        }

        socket.data.user = user;
        console.log(`Socket authenticated: ${user.username}`);
        next();

    } catch (err) {
        console.log("Error in socket auth: ", err);
        next(new Error("Unauthorized"));
    }

}