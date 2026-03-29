import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "sonner";

interface User {
    id: string;
    email: string;
    isOnboarded: boolean;
    username: string | null;
    avatar: string | null;
    bio: string | null;
};

interface AuthStore {
    user: User | null;
    isCheckingAuth: boolean;
    isSigningUp: boolean;
    isLoggingIn: boolean;

    checkAuth: () => Promise<void>;
    signup: (data: { email: string, password: string }) => Promise<void>;
    login: (data: { input: string, password: string }) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ user: response.data })
            console.log(get().user);
            
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
            set({ user: response.data })
            console.log(get().user);
        } catch (err: any) {
            console.log("Signup failed: ", err.response?.data?.message || err.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post("/auth/login", data);
            set({ user: response.data })
            console.log(get().user);
        } catch (err: any) {
            set({ user: null });
            console.log("Login failed: ", err.response?.data?.message || err.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null });
        } catch (err: any) {
            console.log("Logout failed: ", err.response?.data?.message || err.message);
        }
    },
}))

