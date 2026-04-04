import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { Response } from "express";

// to be implemented
const getAllRoomChats = (req: AuthRequest, res: Response) => {
    try {

    } catch (err: any) {
        throw new Error(err.message || "Failed to fetch rooms")
    }
}

export default getAllRoomChats; 