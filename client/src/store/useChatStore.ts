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

    fetchChats: async () => {
        set({ isLoadingChats: true });
        try {
            const response = await axiosInstance.get("/chat");
            set({ chats: response.data });
        } catch (err: any) {
            console.error("Failed to fetch chats: ", err.message);
            throw new Error(err.response?.data || err.message || "Failed to fetch chats");
        } finally {
            set({ isLoadingChats: false });
        }
    },

    fetchMessages: async (chatId, chatType) => {
        set({ isLoadingMessages: true });
        try {
            const response = await axiosInstance.get(`/message/${chatId}?type=${chatType}`);
            set({ messages: response.data });
        } catch (err: any) {
            console.error("Failed to load messages: ", err.message);
            throw new Error(err.response?.data || err.message || "Failed to load messages");
        } finally {
            set({ isLoadingMessages: false });
        }
    },

    sendMessage: async (data) => {
        set({ isSendingMessage: true });
        try {
            const response = await axiosInstance.post("/message/send", data);
            set({ messages: [...get().messages, response.data] });

            await get().fetchChats();
        } catch (err: any) {
            console.error("Failed to send message: ", err.message);
            throw new Error(err.response?.data || err.message || "Failed to send message");
        } finally {
            set({ isSendingMessage: false });
        }
    },

    createDirectChat: async (targetUserId) => {
        try {
            const response = await axiosInstance.post("/chat/direct", { targetUserId });
            const newChat = response.data;

            set((state) => ({
                chats: [newChat, ...state.chats.filter(chat => chat.id !== newChat.id)];
            }));
        } catch (err: any) {
            console.error("Failed to create/retrieve direct chat: ", err);
            throw new Error(err.response?.data || err.message || "Failed to create direct chat");
        }
    },

    createGroup: async (data) => {
        try {
            const response = await axiosInstance.post("/chat/group", data);
            const newGroup = response.data;
            set((state) => ({
                chats: [newGroup, ...state.chats]
            }))
            // why cant i do set({ chats: [newGroup, get().chats] })
        } catch (err: any) {
            console.error("Failed to create group chat: ", err);
            throw new Error(err.response?.data || err.message || "Failed to create group chat");
        }
    },

    searchUsers: async (searchKey) => {
        if (!searchKey || searchKey.length < 2) {
            set({ searchResults: [] });
            return;
        };
        
        set({ isSearching: true });
        try {
            const response = await axiosInstance.post("/user/search", { searchKey });
            set({ searchResults: response.data });
        } catch(err: any) {
            console.error("User search failed: ", err);
            throw new Error(err.response?.data || err.message || "User search failed");
        } finally {
            set({ isSearching: false })
        }
    },

    setActiveChat: (chat) => { set({ chats: [] }) },

    clearMessages: () => { set({ messages: [] }) },

}));