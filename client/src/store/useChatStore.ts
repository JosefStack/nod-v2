import { create } from "zustand";
import axiosInstance from "../lib/axios";



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


interface ChatStore {
    chats: Chat[];
    activeChat: Chat | null;
    messages: Message[];
    isLoadingChats: boolean;
    isLoadingMessages: boolean;
    isSendingMessage: boolean;
    searchResults: User[];
    isSearching: boolean;

    fetchChats: () => Promise<void>;
    fetchMessages: (chatId: string, chatType: string) => Promise<void>;
    sendMessage: (data: { chatId: string, chatType: string, content: string, attachments?: any[] }) => Promise<void>;
    createDirectChat: (targetUserId: string) => Promise<void>;
    createGroup: (date: { groupName: string, memberIds: string[], groupDescription?: string, groupAvatar?: string }) => Promise<void>;
    searchUsers: (searchKey: string) => Promise<void>;

    setActiveChat: (chat: Chat | null) => void;
    clearMessages: () => void;
}


export const useChatStore = create<ChatStore>((set, get) => ({

    // initial state
    chats: [],
    activeChat: null,
    isLoadingChats: false,

    messages: [],
    isLoadingMessages: false,

    isSendingMessage: false,

    searchResults: [],
    isSearching: false,

    // functions

    fetchChats: async () => {},

    fetchMessages: async (chatId, chatType) => { },

    sendMessage: async (data) => { },

    createDirectChat: async (targetUserId) => { },

    createGroup: async (data) => { },

    searchUsers: async (searchKey) => { },

    setActiveChat: (chat) => { set({ chats: [] }) },

    clearMessages: () => { set({ messages: [] }) },

}))