import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { auth } from "../lib/auth.js";
import "cookie-parser";

export interface AuthRequest<
    Body = any,
    Query = any,
    Params = any
> extends Request<Params, any, Body, Query> {
    user?: {
        id: string;
        email: string;
        username: string | null;
        isOnboarded: boolean;
        image: string;
    };
    cookies: { [key: string]: string };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            const session = await auth.api.getSession({
                headers: req.headers as any,
            });

            if (session?.user) {
                const user = await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { id: true, email: true, isOnboarded: true, username: true, avatar: true, bio: true, image: true, name: true },
                });

                if (!user) return res.status(401).json({ message: "Unauthorized - User not found" })
                req.user = user;
            }

            next();
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, username: true, name: true, isOnboarded: true, avatar: true, bio: true, image: true },
        });

        if (!user) return res.status(401).json({ message: "Unauthorized - User not found" });

        req.user = user;
        next();

    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }


}