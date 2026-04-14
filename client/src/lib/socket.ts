import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000";

let socket: Socket | null = null;

export const connectSocket = (token?: string): Socket => {
    if (socket && socket.connected) return socket;

    socket = io(SOCKET_URL, {
        withCredentials: true,
        auth: { token },
        transports: ['websocket'],
    });

    return socket;
};

export const disconnectSocket = () => {
    socket?.disconnect();
};

export const getSocket = () => socket;
