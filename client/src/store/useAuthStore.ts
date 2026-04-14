import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { authClient } from "@/lib/authClient";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useChatStore } from "./useChatStore";

export interface User {
    id: string;
    email: string;
    isOnboarded: boolean;
    username: string | null;
    avatar: string | null;
    bio: string | null;
    name: string | null;
    image: string | null;
};

interface AuthStore {
    user: User | null;
    isCheckingAuth: boolean;
    isSigningUp: boolean;
    isLoggingIn: boolean;

    setUser: (updatedUser: User) => void;

    checkAuth: () => Promise<void>;
    signup: (data: { email: string, password: string }) => Promise<void>;
    login: (data: { input: string, password: string }) => Promise<void>;
    logout: () => Promise<void>;

    signInWithGoogle: () => Promise<void>;
    signInWithGithub: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, _) => ({
    user: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,

    setUser: (updatedUser: User) => {
        set({ user: updatedUser });
    },

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            const { token, ...user } = response.data ?? {};
            set({ user: response.data ? user : null });
            const socket = connectSocket(token);
            useChatStore.getState().initSocketListeners(socket);
        } catch (err) {
            console.error("Auth check failed: ", err);
            set({ user: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            set({ user: response.data });
        } catch (err: any) {
            console.log("Signup failed: ", err.response?.data?.message || err.message);
            throw new Error(err.response?.data?.message || err?.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post("/auth/login", data);
            const { token, ...user } = response.data;
            set({ user });
            const socket = connectSocket(token);
            useChatStore.getState().initSocketListeners(socket);
        } catch (err: any) {
            set({ user: null });
            console.log("Login failed: ", err.response?.data?.message || err.message);
            throw new Error(err.response?.data?.message || err?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null });
            disconnectSocket();
        } catch (err: any) {
            console.log("Logout failed: ", err.response?.data?.message || err.message);
        }
    },

    signInWithGoogle: async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: import.meta.env.DEV ? "http://localhost:5173/" : import.meta.env.VITE_CALLBACK_URL,
        });
    },

    signInWithGithub: async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: import.meta.env.DEV ? "http://localhost:5173/" : import.meta.env.VITE_CALLBACK_URL,
        });
    },

}))
