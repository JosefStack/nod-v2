import { prisma } from "../../lib/prisma.ts";
import { AuthRequest } from "../../middleware/auth.middleware.ts";
import { Response } from "express";

// to be implemented
const getAllRoomChats = (req: AuthRequest, res: Response) => {
    try {

    } catch (err: any) {
        throw new Error(err.message || "Failed to fetch rooms")
    }
}

export default getAllRoomChats; 