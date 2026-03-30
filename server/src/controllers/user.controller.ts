import { Response } from "express";
import { prisma } from "../lib/prisma.ts";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import cloudinary from "../lib/cloudinary.ts";


export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { username = null, avatar = null, bio = null, fullName = null } = req.body;

        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        let avatarURL: string | null = null;
        if (avatar) {
            const uploadResponse = await cloudinary.uploader.upload(avatar, {
                folder: "nod/avatars",
            });
            avatarURL = uploadResponse.secure_url;
        };

        if (username) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    username,
                    NOT: { id: userId },
                },

            });

            if (existingUser) {
                throw new Error("Username already taken");
            }
        };

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(username && { username }),
                ...(avatarURL && { avatar: avatarURL }),
                ...(bio && { bio }),
                ...(fullName && { name: fullName }),
                isOnboarded: true,
            },
            select: { id: true, email: true, username: true, isOnboarded: true, avatar: true, bio: true, name: true },
        })

        return res.status(200).json(updatedUser);

    } catch (err: any) {
        if (err.message === "Username already taken") {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ message: "Failed to update profile" });
    }
}