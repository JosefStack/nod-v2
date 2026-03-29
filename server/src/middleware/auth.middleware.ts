import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.ts";
import { NetConnectOpts } from "node:net";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        username: string | null;
        isOnboarded: boolean;
    }
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {

    try {

        const token = req.cookies.jwt;

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {id: true, email: true, username: true, isOnboarded: true,  avatar: true, bio: true},
        });

        if (!user) return res.status(401).json({ message: "Unauthorized - User not found" });

        req.user = user;
        next();

    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }


}