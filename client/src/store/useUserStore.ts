import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


interface UserStore {

    completeOnboarding: (data: { username: string, avatar: string | null, bio: string | null, fullName: string }) => Promise<void>;

}

export const useUserStore = create<UserStore>((set, get) => ({
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