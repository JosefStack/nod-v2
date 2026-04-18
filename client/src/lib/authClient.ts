import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.DEV 
        ? "http://localhost:3000"
        : import.meta.env.VITE_API_URL.replace("/api", ""),
}); 