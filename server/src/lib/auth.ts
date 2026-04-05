import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
    baseURL: process.env.NODE_ENV === "production" ? process.env.BETTER_AUTH_URL! : "http://localhost:3000",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    advanced: {
        defaultCookieAttributes: {
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
        }
    },
    
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
    trustedOrigins: [
        process.env.NODE_ENV === "production"
            ? process.env.CLIENT_URL   // only prod frontend
            : "http://localhost:5173",
        process.env.NODE_ENV === "production"
            ? process.env.BETTER_AUTH_URL
            : "http://localhost:3000",
    ],

    cookies: {
        sessionToken: {
            attributes: {
                secure: true,
                sameSite: "none",
            },
        },
    },


});