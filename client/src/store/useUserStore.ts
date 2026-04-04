import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


interface UserStore {
    checkUsername: (data: { username: string }) => Promise<void>;
    completeOnboarding: (data: { username: string, avatar: string | null, bio: string | null, fullName: string }) => Promise<void>;
}

export const useUserStore = create<UserStore>((_, _) => ({

    checkUsername: async (data) => {
        try {
            const response = await axiosInstance.post("/user/check-username", data);
            const { available } = response.data;
            return available;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err?.message || "Username validation failed");
        }
    },

    completeOnboarding: async (data) => {
        try {
            const { setUser } = useAuthStore.getState();;
            const response = await axiosInstance.patch("/user/update-profile", data);
            setUser(response.data);
        } catch (err: any) {
            console.log("Onboarding failed: ", err.response?.data?.message || err.message || "Onboarding failed");
            throw new Error(err.response?.data?.message || err?.message || "Onboarding failed");    
        }
    }

}));    

