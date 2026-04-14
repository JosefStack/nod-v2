import { io, Socket } from "socket.io-client";



const getToken = () =>  document.cookie
    .split("; ")
    .find(row => row.startsWith("jwt="))
    ?.split("=")[1];

console.log(document.cookie);

const SOCKET_URL = import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL?.replace("/api", "") || ""
    : "http://localhost:3000";


let socket: Socket | null = null;


export const connectSocket = (): Socket => {
    if (socket && socket.connected) return socket;

    socket = io(SOCKET_URL, {
        withCredentials: true,
        auth: { token: getToken() }
    });

    return socket;
};

export const disconnectSocket = () => {
    socket?.disconnect();
};

export const getSocket = () => socket;

