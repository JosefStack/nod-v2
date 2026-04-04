import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.ts";
import { auth } from "../lib/auth.ts";
export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            const session = await auth.api.getSession({
                headers: req.headers,
            });
            if (session?.user) {
                const user = await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { id: true, email: true, isOnboarded: true, username: true, avatar: true, bio: true, image: true, name: true },
                });
                if (!user)
                    return res.status(401).json({ message: "Unauthorized - User not found" });
                req.user = user;
            }
            next();
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, username: true, name: true, isOnboarded: true, avatar: true, bio: true, image: true },
        });
        if (!user)
            return res.status(401).json({ message: "Unauthorized - User not found" });
        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};
