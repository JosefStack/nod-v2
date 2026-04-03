import { Router } from "express";
import { Response } from "express";
import { protect } from "../middleware/auth.middleware.ts";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import { getAllChats, getAllRooms } from "../controllers/chat.controller.ts"
import { getOrCreateDirectChat } from "../controllers/chat/direct.controller.ts";


const chatRouter = Router();

chatRouter.use(protect);

chatRouter.get("/", getAllChats);
chatRouter.get("/room", getAllRooms);

chatRouter.post("/direct", getOrCreateDirectChat);


export default chatRouter;  