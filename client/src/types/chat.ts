export interface User {
    id: string,
    username: string,
    name: string,
    avatar?: string | null,
};

export interface Attachment {
    id: string;
    url: string;
    fileName?: string | null;
    size?: string | null;
    width?: string | null;
    height?: string | null;
    duration?: string | null;
    createdAt: string | null;
};

export interface LastMessage {
    preview?: string | null;
    createdAt?: string | null;
    sender?: string | null;
};

export interface Chat {
    id: string;
    type: "direct" | "group" | "room";
    name: string;
    username?: string | null;
    avatar?: string | null;
    unreadCount: number;
    lastMessage?: LastMessage
}

export interface Message {
    id: string;
    content?: string | null;
    senderId: string;
    createdAt: string;
    updatedAt: string;
    sender: User;
    attachments: Attachment[]
    readBy: { userId: string }[]
};