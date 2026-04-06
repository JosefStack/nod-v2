import { create } from "zustand";
import axiosInstance from "../lib/axios";
import type { User, Chat, Message } from "@/types/chat";

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
    createGroup: (data: { groupName: string, memberIds: string[], groupDescription?: string, groupAvatar?: string }) => Promise<void>;
    searchUsers: (searchKey: string) => Promise<void>;

    setActiveChat: (chat: Chat | null) => Promise<void>;
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
            set((state) => ({
                messages: [...state.messages, response.data]
            }))
            // below line of code would update the preview, but chatList component will reload (will show skeleton) on every new message that is sent
            // await get().fetchChats(); 
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
                chats: [newChat, ...state.chats.filter(chat => chat.id !== newChat.id)]
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
            // why cant i do set({ chats: [newGroup, get().chats] }) => its slightly slower cs i got to lookup the previoud state using get()
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

    setActiveChat: async (chat) => { 
        set({ activeChat: chat });
        if ( chat ) {
            await get().fetchMessages(chat.id, chat.type);
        }
    },

    clearMessages: () => { set({ messages: [] }) },

}));